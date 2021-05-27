const BigNumber = require('bignumber.js');
const { fantomWeb3: web3 } = require('../../../utils/web3');

const MasterChef = require('../../../abis/fantom/SpiritChef.json');
const pools = require('../../../data/fantom/spiritPools.json');
const fetchPrice = require('../../../utils/fetchPrice');
const {
  getTotalLpStakedInUsd,
  getTotalStakedInUsd,
} = require('../../../utils/getTotalStakedInUsd');
const { compound } = require('../../../utils/compound');

const masterchef = '0x9083EA3756BDE6Ee6f27a6e996806FBD37F6F093';
const oracle = 'tokens';
const oracleId = 'SPIRIT';

const DECIMALS = '1e18';
const CHAIN_ID = 250;
const secondsPerYear = 31536000;

const getSpiritApys = async () => {
  let apys = {};

  let promises = [];
  pools.forEach(pool => promises.push(getPoolApy(masterchef, pool)));
  const values = await Promise.all(promises);
  for (item of values) {
    apys = { ...apys, ...item };
  }

  return apys;
};

const getPoolApy = async (masterchef, pool) => {
  let getTotalStaked;
  if (pool.token) {
    getTotalStaked = getTotalStakedInUsd(
      masterchef,
      pool.token,
      pool.oracle,
      pool.oracleId,
      pool.decimals,
      CHAIN_ID
    );
  } else {
    getTotalStaked = getTotalLpStakedInUsd(masterchef, pool, CHAIN_ID);
  }
  const [yearlyRewardsInUsd, totalStakedInUsd] = await Promise.all([
    getYearlyRewardsInUsd(masterchef, pool),
    getTotalStaked,
  ]);
  const simpleApy = yearlyRewardsInUsd.dividedBy(totalStakedInUsd);
  const apy = compound(simpleApy, process.env.BASE_HPY, 1, 0.955);
  console.log(
    pool.name,
    simpleApy.valueOf(),
    apy.valueOf(),
    totalStakedInUsd.valueOf(),
    yearlyRewardsInUsd.valueOf()
  );
  return { [pool.name]: apy };
};

const getYearlyRewardsInUsd = async (masterchef, pool) => {
  const masterchefContract = new web3.eth.Contract(MasterChef, masterchef);

  const rewards = new BigNumber(await masterchefContract.methods.spiritPerBlock().call());

  let { allocPoint } = await masterchefContract.methods.poolInfo(pool.poolId).call();
  allocPoint = new BigNumber(allocPoint);

  const totalAllocPoint = new BigNumber(await masterchefContract.methods.totalAllocPoint().call());

  const poolBlockRewards = rewards.times(allocPoint).dividedBy(totalAllocPoint);

  const secondsPerBlock = 1;
  const yearlyRewards = poolBlockRewards.dividedBy(secondsPerBlock).times(secondsPerYear);

  const tokenPrice = await fetchPrice({ oracle, id: oracleId });
  const yearlyRewardsInUsd = yearlyRewards.times(tokenPrice).dividedBy(DECIMALS);

  return yearlyRewardsInUsd;
};

module.exports = getSpiritApys;

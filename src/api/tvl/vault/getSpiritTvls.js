const BigNumber = require('bignumber.js');
const { fantomWeb3: web3, web3Factory } = require('../../../utils/web3');

const MasterChef = require('../../../abis/fantom/SpiritChef.json');
const pools = require('../../../data/fantom/spiritPools.json');
const fetchPrice = require('../../../utils/fetchPrice');
const {
  getTotalLpStakedInUsd,
  getTotalStakedInUsd,
} = require('../../../utils/getEsterStakedInUsd');
const { compound } = require('../../../utils/compound');

const masterchef = '0x9083EA3756BDE6Ee6f27a6e996806FBD37F6F093';
const oracle = 'tokens';
const oracleId = 'SPIRIT';

const DECIMALS = '1e18';
const CHAIN_ID = 250;
const secondsPerYear = 31536000;

const getSpiritPoolTvls = async () => {
  let tvls = {};

  let promises = [];
  pools.forEach(pool => promises.push(getPoolTvl(masterchef, pool)));
  const values = await Promise.all(promises);
  for (item of values) {
    tvls = { ...tvls, ...item };
  }

  return tvls;
};

const getPoolTvl = async (masterchef, pool) => {
  const web3 = web3Factory(CHAIN_ID);
  const masterchefContract = new web3.eth.Contract(MasterChef, masterchef);
  let { amount } = await masterchefContract.methods.userInfo(pool.poolId, pool.strategy).call();
  console.log(pool.name + ' : ' + amount);

  let getTotalStaked;
  if (pool.token) {
    getTotalStaked = getTotalStakedInUsd(amount, pool.oracle, pool.oracleId, pool.decimals);
  } else {
    getTotalStaked = getTotalLpStakedInUsd(amount, pool);
  }
  const [totalStakedInUsd] = await Promise.all([getTotalStaked]);

  return { [pool.name]: totalStakedInUsd * 1 };
};

module.exports = getSpiritPoolTvls;

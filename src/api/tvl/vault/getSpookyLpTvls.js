const BigNumber = require('bignumber.js');
const { fantomWeb3: web3, web3Factory } = require('../../../utils/web3');

const MasterChef = require('../../../abis/fantom/SpookyChef.json');
const fetchPrice = require('../../../utils/fetchPrice');
const pools = require('../../../data/fantom/spookyLpPools.json');
const { compound } = require('../../../utils/compound');

const ERC20 = require('../../../abis/ERC20.json');
const { lpTokenPrice } = require('../../../utils/lpTokens');

const masterchef = '0x2b2929E785374c651a81A63878Ab22742656DcDd';
const oracleId = 'BOO';
const oracle = 'tokens';
const DECIMALS = '1e18';

const getSpookyLpTvls = async () => {
  let apys = {};

  for (const pool of pools) {
    try {
      const apy = await getPoolApy(masterchef, pool);
      apys = { ...apys, ...apy };
    } catch (e) {
      console.error('getSpookyLpApys error', e);
    }
  }

  return apys;
};

const getPoolApy = async (masterchef, pool) => {
  const [totalStakedInUsd] = await Promise.all([getTotalLpStakedInUsd(masterchef, pool)]);
  return { [pool.name]: totalStakedInUsd };
};

const getTotalLpStakedInUsd = async (targetAddr, pool) => {
  const web3 = web3Factory(250);
  const masterchefContract = new web3.eth.Contract(MasterChef, masterchef);
  let { amount } = await masterchefContract.methods.userInfo(pool.poolId, pool.strategy).call();
  const totalStaked = new BigNumber(amount);
  const tokenPrice = await lpTokenPrice(pool);
  const totalStakedInUsd = totalStaked.times(tokenPrice).dividedBy('1e18');
  return totalStakedInUsd;
};

module.exports = getSpookyLpTvls;

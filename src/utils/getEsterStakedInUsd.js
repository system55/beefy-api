const BigNumber = require('bignumber.js');
const { bscWeb3: web3, web3Factory } = require('./web3');

const ERC20 = require('../abis/ERC20.json');
const fetchPrice = require('./fetchPrice');
const { lpTokenPrice } = require('./lpTokens');

const getTotalStakedInUsd = async (amount, oracle, oracleId, decimals = '1e18') => {
  const totalStaked = new BigNumber(amount);

  const tokenPrice = await fetchPrice({ oracle, id: oracleId });

  return totalStaked.times(tokenPrice).dividedBy(decimals);
};

const getTotalLpStakedInUsd = async (amount, pool) => {
  const totalStaked = new BigNumber(amount);
  const tokenPrice = await lpTokenPrice(pool);
  const totalStakedInUsd = totalStaked.times(tokenPrice).dividedBy('1e18');
  return totalStakedInUsd;
};

module.exports = { getTotalStakedInUsd, getTotalLpStakedInUsd };

const BigNumber = require('bignumber.js');
const { fantomWeb3: web3, web3Factory } = require('../../../utils/web3');

const MasterChef = require('../../../abis/fantom/SpookyIFO.json');
const fetchPrice = require('../../../utils/fetchPrice');
const { compound } = require('../../../utils/compound');

const ERC20 = require('../../../abis/ERC20.json');

const masterchef = '0xACACa07e398d4946AD12232F40f255230e73Ca72';
const boo = '0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE';
const oracleId = 'BOO';
const oracle = 'tokens';
const DECIMALS = '1e18';
const boo_strategy = '0xe07363E28A4068Bd46E4cd4de3faf36220Bb23FA';

const getSpookyBooTvl = async () => {
  const [totalStakedInUsd] = await Promise.all([getTotalStakedInUsd()]);
  return { 'boo-boo': totalStakedInUsd * 1 };
};

const getTotalStakedInUsd = async () => {
  const web3 = web3Factory(250);
  const masterchefContract = new web3.eth.Contract(MasterChef, masterchef);
  let { amount } = await masterchefContract.methods.userInfo(0, boo_strategy).call();
  // const tokenContract = new web3.eth.Contract(ERC20, boo);
  const totalStaked = new BigNumber(amount);
  const tokenPrice = await fetchPrice({ oracle, id: oracleId });
  const totalStakedInUsd = totalStaked.times(tokenPrice).dividedBy('1e18');
  return totalStakedInUsd;
};

module.exports = getSpookyBooTvl;

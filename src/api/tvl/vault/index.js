const getSpiritPoolTvls = require('./getSpiritTvls');
const getSpookyBooTvl = require('./getSpookyBooTvl');
const getSpookyLpTvls = require('./getSpookyLpTvls');

const getTvls = [getSpiritPoolTvls, getSpookyBooTvl, getSpookyLpTvls];
// const getApys = [getSpiritApys];

const getEsterTvls = async () => {
  let tvls = {};

  for (const getTvl of getTvls) {
    try {
      const tvl = await getTvl();
      tvls = { ...tvls, ...tvl };
      // console.log('----apys-----', apys);
    } catch (e) {
      console.error('FantomTvl error', getTvl.name, e);
    }
  }

  return tvls;
};

module.exports = { getEsterTvls };

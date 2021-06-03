const { getEsterTvls } = require('./vault');

const INIT_DELAY = 30 * 1000;
const REFRESH_INTERVAL = 15 * 60 * 1000;

let apys = {};

const getApys = () => {
  return apys;
};

const updateApys = async () => {
  console.log('> updating tvls');

  try {
    const results = await Promise.allSettled([getEsterTvls()]);

    for (const result of results) {
      if (result.status !== 'fulfilled') {
        console.warn('getApys error', result.reason);
        continue;
      }
      apys = { ...apys, ...result.value };
    }

    console.log('> updated tvls');
  } catch (err) {
    console.error('> apy initialization failed', err);
  }

  setTimeout(updateApys, REFRESH_INTERVAL);
};

setTimeout(updateApys, INIT_DELAY);

module.exports = getApys;

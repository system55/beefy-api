'use strict';

const Router = require('koa-router');
const router = new Router();

const noop = require('./api/noop');
const stats = require('./api/stats');
const tvl = require('./api/tvl');
const supply = require('./api/supply');
const price = require('./api/price');
const gov = require('./api/stats/gov');
const cmc = require('./api/cmc');

router.get('/apy', stats.apy);
router.get('/cmc', cmc.vaults);

router.get('/supply', supply.supply);
router.get('/supply/total', supply.total);
router.get('/supply/circulating', supply.circulating);

router.get('/tvl', tvl.tvl);

router.get('/earnings', gov.earnings);
router.get('/holders', gov.holderCount);

router.get('/lps', price.lpsPrices);
router.get('/prices', price.tokenPrices);

router.get('/', noop);

module.exports = router;

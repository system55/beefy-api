'use strict';

const getTvls = require('./getTvls');

const TIMEOUT = 5 * 60 * 1000;

async function tvl(ctx) {
  try {
    ctx.request.socket.setTimeout(TIMEOUT);
    let tvls = await getTvls();

    if (Object.keys(tvls).length === 0) {
      throw 'There is no TVLs data yet';
    }

    ctx.status = 200;
    ctx.body = tvls;
  } catch (err) {
    ctx.throw(500, err);
  }
}

module.exports = { tvl };

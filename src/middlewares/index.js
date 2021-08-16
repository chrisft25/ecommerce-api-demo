const jsonBodyParser = require('@middy/http-json-body-parser');
const middy = require('@middy/core');
const http = require('./http');
const redisMiddleware = require('./redis');
const db = require('./db');
const logger = require('./logger');
const jwt = require('./jwt');

const disableEventLoop = () => ({
  before: async (req) => {
    req.context.callbackWaitsForEmptyEventLoop = false;
  },
});

let middlewares = [
  http(),
  disableEventLoop(),
  jsonBodyParser(),
  logger(),
  jwt(),
  db(),
];

// Set redis middleware to optional
const { REDIS_ACTIVE = 0 } = process.env;
if (REDIS_ACTIVE && parseInt(REDIS_ACTIVE, 10) === 1) {
  middlewares = [redisMiddleware(), ...middlewares];
}
const functions = (fns = []) => {
  let functionsToExport = {};
  fns.forEach((e) => {
    functionsToExport = {
      ...functionsToExport,
      [e.name]: middy(e).use(middlewares),
    };
  });
  return functionsToExport;
};

module.exports = { functions };

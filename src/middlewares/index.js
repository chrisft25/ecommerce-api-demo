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

const middlewares = [
  disableEventLoop(),
  jsonBodyParser(),
  db(),
  logger(),
  http(),
  jwt(),
];

// Set redis middleware to optional
const { REDIS_ACTIVE = 0 } = process.env;
if (REDIS_ACTIVE === 1) {
  middlewares.push(redisMiddleware());
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

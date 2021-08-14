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
  redisMiddleware(),
  logger(),
  http(),
  jwt(),
];

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

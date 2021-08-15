const redis = require('redis');
const { promisify } = require('util');
const logger = require('../lib/logger')({ name: 'Redis Middleware' });

const {
  REDIS_PORT = 6379, REDIS_HOST, REDIS_PASS, REDIS_TTL = 300,
} = process.env;
const client = redis.createClient(REDIS_PORT, REDIS_HOST, { password: REDIS_PASS });
client.on('error', (err) => {
  logger.error('Error:', err);
});
const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const expire = promisify(client.expire).bind(client);

module.exports = () => {
  const redisMiddlewareBefore = async (req) => {
    const { body, queryStringParameters, pathParameters } = req.event;
    const search = {
      fnName: req.context.functionName,
      data: { body, queryStringParameters, pathParameters },
    };
    logger.info('Searching on redis...', search);
    const resp = await get(JSON.stringify(search));
    if (resp) {
      logger.info('Found', resp);
      return { cache: true, ...JSON.parse(resp) };
    }
  };

  const redisMiddlewareAfter = async (req) => {
    const { body, queryStringParameters, pathParameters } = req.event;
    const search = {
      fnName: req.context.functionName,
      data: { body, queryStringParameters, pathParameters },
    };
    logger.info('Saving on redis...', JSON.stringify(req.event.redisResponse));
    const res = await set(JSON.stringify(search), JSON.stringify(req.event.redisResponse));
    await expire(JSON.stringify(search), REDIS_TTL);
    logger.info(res);
    return req.event.redisResponse;
  };

  return {
    before: redisMiddlewareBefore,
    after: redisMiddlewareAfter,
  };
};

const redis = require('redis');
const { promisify } = require('util');
const logger = require('../lib/logger')({ name: 'Redis Middleware' });

const {
  REDIS_PORT = 6379, REDIS_HOST, REDIS_PASS, REDIS_TTL = 300,
} = process.env;

module.exports = () => {
  const redisMiddlewareBefore = async (req) => {
    const { body, queryStringParameters, pathParameters } = req.event;
    const client = redis.createClient(REDIS_PORT, REDIS_HOST, { password: REDIS_PASS });
    const get = promisify(client.get).bind(client);
    const set = promisify(client.set).bind(client);
    const expire = promisify(client.expire).bind(client);
    const quit = promisify(client.quit).bind(client);
    const search = {
      fnName: req.context.functionName,
      data: { body, queryStringParameters, pathParameters },
    };
    logger.info('Searching on redis...', search);
    const resp = await get(JSON.stringify(search));
    if (resp) {
      logger.info('Found', resp);
      await quit();
      return {
        ...JSON.parse(resp),
        body: JSON.stringify(
          {
            cache: true,
            ...JSON.parse(JSON.parse(resp).body),
          },
        ),
      };
    }
    req.event.redis = {
      get, set, expire, quit,
    };
  };

  const redisMiddlewareAfter = async (req) => {
    const {
      body, queryStringParameters, pathParameters, redis: redisInstance,
    } = req.event;
    const search = {
      fnName: req.context.functionName,
      data: { body, queryStringParameters, pathParameters },
    };
    logger.info('Saving on redis...', JSON.stringify(req.event.redisResponse));
    const res = await redisInstance.set(
      JSON.stringify(search),
      JSON.stringify(req.event.redisResponse),
    );
    await redisInstance.expire(JSON.stringify(search), REDIS_TTL);
    logger.info(res);
    await redisInstance.quit();
    return req.event.redisResponse;
  };

  return {
    before: redisMiddlewareBefore,
    after: redisMiddlewareAfter,
  };
};

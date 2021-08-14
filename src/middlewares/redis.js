const redis = require('redis');
const logger = require('../lib/logger')({ name: 'Redis Middleware' });

module.exports = () => {
  const redisMiddlewareBefore = async () => {
    const { REDIS_PORT = 6379, REDIS_HOST, REDIS_PASS } = process.env;
    const client = redis.createClient(REDIS_PORT, REDIS_HOST, { password: REDIS_PASS });
    client.on('error', (err) => {
      logger.error('Error:', err);
    });
  };

  return {
    before: redisMiddlewareBefore,
  };
};

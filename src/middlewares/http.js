const logger = require('../lib/logger')({ name: 'HTTP Middleware' });

const headersResponse = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': true,
};

module.exports = () => {
  const httpMiddlewareBefore = async ({ event }) => {
    const {
      body, queryStringParameters, pathParameters, headers,
    } = event;
    logger.info('Request Params', {
      body, queryStringParameters, pathParameters, headers,
    });
  };
  const httpMiddlewareAfter = async ({ event, response: resp }) => {
    let response = {};

    if (resp) {
      let type = 'object';

      if (Array.isArray(resp)) {
        type = 'array';
      } else {
        type = typeof resp;
      }

      const options = {
        array: {
          data: resp,
        },
        object: {
          ...resp,
        },
        string: {
          message: resp,
        },
      };

      response = {
        statusCode: (resp.statusCode) ? resp.statusCode : 200,
        body: {
          error: !!(resp.error),
          ...options[type],
        },
      };
    } else {
      response = {
        statusCode: 500,
        body: { error: true, message: 'An error has occurred.' },
      };
    }
    delete response.body.statusCode;
    const finalResponse = {
      ...response,
      headers: headersResponse,
      body: JSON.stringify(response.body),
    };
    const { REDIS_ACTIVE = 0 } = process.env;
    if (REDIS_ACTIVE && parseInt(REDIS_ACTIVE, 10) === 1 && event.cache) {
      event.redisResponse = finalResponse;
    } else {
      event.redis.quit();
      logger.info('Lambda Response', finalResponse);
      return finalResponse;
    }
  };

  return {
    before: httpMiddlewareBefore,
    after: httpMiddlewareAfter,
  };
};

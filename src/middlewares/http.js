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
  const httpMiddlewareAfter = async ({ response: resp }) => {
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

    const finalResponse = {
      ...response,
      headers: headersResponse,
      body: JSON.stringify(response.body),
    };
    logger.info('Lambda Response', finalResponse);
    return finalResponse;
  };

  return {
    before: httpMiddlewareBefore,
    after: httpMiddlewareAfter,
  };
};

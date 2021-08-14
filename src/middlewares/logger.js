const logger = require('../lib/logger');

module.exports = () => {
  const loggerMiddlewareBefore = async (req) => {
    req.event.logger = logger({ name: req.context.functionName });
  };

  return {
    before: loggerMiddlewareBefore,
  };
};

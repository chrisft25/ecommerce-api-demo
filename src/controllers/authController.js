const jwt = require('jsonwebtoken');
const logger = require('../lib/logger')({ name: 'Auth Controller' });

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
module.exports.auth = (event, context, callback) => {
  if (!event.authorizationToken) {
    return callback('Unauthorized');
  }

  const tokenParts = event.authorizationToken.split(' ');
  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // no auth token!
    return callback('Unauthorized');
  }
  const { JWT_KEY } = process.env;
  logger.log(process.env);
  try {
    jwt.verify(tokenValue, JWT_KEY, (verifyError, decoded) => {
      if (verifyError) {
        logger.error('Error verifying token: ', verifyError);
        // 401 Unauthorized
        logger.error(`Token invalid. ${verifyError}`);
        return callback('Unauthorized');
      }
      // is custom authorizer function
      logger.info('valid from customAuthorizer', decoded);
      return callback(null, generatePolicy(decoded.id, 'Allow', '*'));
    });
  } catch (err) {
    logger.info('Error. Invalid token', err);
    return callback('Unauthorized');
  }
};

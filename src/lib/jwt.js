const jwt = require('jsonwebtoken');
const logger = require('./logger')({ name: 'JWT Module' });

const { JWT_KEY, JWT_EXPIRES } = process.env;

const signJWT = (payload) => {
  try {
    logger.info('Encoding payload: ', payload);
    const token = jwt.sign(payload, JWT_KEY, {
      expiresIn: JWT_EXPIRES,
    });
    logger.info('Encoded Token: ', token);
    return token;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

const decodeJWT = (token) => {
  try {
    logger.info(`Decoding payload from ${token}`);
    return jwt.verify(token, JWT_KEY, (error, decoded) => {
      if (error) {
        logger.error('Token is not valid');
        return null;
      }
      logger.info('Decoded payload: ', decoded);
      return decoded;
    });
  } catch (error) {
    logger.error(error);
    return null;
  }
};

module.exports = {
  decodeJWT,
  signJWT,
};

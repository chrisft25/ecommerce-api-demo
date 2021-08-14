const jwt = require('../lib/jwt');

module.exports = () => {
  const jwtMiddlewareBefore = async (req) => {
    if (req.event.authorizationToken) {
      const tokenParts = req.event.authorizationToken.split(' ');
      const tokenValue = tokenParts[1];

      if ((tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
        req.event.token = jwt.decodeJWT(tokenValue);
      }
    }
  };

  return {
    before: jwtMiddlewareBefore,
  };
};

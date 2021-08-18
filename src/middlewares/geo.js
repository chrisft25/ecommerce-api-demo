const geoip = require('geoip-lite');

module.exports = () => {
  const geoMiddlewareBefore = async (req) => {
    if (req.event.requestContext) {
      const ip = req.event.requestContext.identity.sourceIp;
      const geo = geoip.lookup(ip);
      req.event.origin = geo;
    }
  };

  return {
    before: geoMiddlewareBefore,
  };
};

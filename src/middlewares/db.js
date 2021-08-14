const { PrismaClient } = require('@prisma/client');
const logger = require('../lib/logger')({ name: 'Database Middleware' });

module.exports = () => {
  const databaseMiddlewareBefore = async (req) => {
    try {
      logger.info('Connecting to database...');
      const prisma = new PrismaClient();
      await prisma.$connect();
      req.event.db = prisma;
      logger.info('Database connected.');
    } catch (error) {
      logger.error(error);
    }
  };
  const databaseMiddlewareAfter = async (req) => {
    req.event.db.$disconnect();
  };

  return {
    before: databaseMiddlewareBefore,
    after: databaseMiddlewareAfter,
  };
};

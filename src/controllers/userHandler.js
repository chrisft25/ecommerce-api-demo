const { functions } = require('../middlewares');

const getUsers = async (event) => {
  const { db, logger } = event;
  let { response } = event;

  try {
    const data = await db.user.findMany();
    logger.info(data);
    response = data;
  } catch (error) {
    logger.error(error);
  }
  return response;
};

module.exports = functions([
  getUsers,
]);

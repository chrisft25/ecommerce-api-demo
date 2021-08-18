const joi = require('joi');
const crypto = require('crypto-js');
const { functions } = require('../middlewares');
const { exclude } = require('../lib/tools');
const jwt = require('../lib/jwt');

const getUsers = async (event) => {
  const { db, logger } = event;
  let { response } = event;
  try {
    const data = exclude((await db.user.findMany()), ['password']);
    logger.info(data);
    response = data;
  } catch (error) {
    logger.error(error);
  }
  return response;
};

const getUserById = async (event) => {
  const { db, logger, pathParameters } = event;
  let { response } = event;
  event.cache = true; // Use redis for cache
  try {
    const schema = joi.object({
      id: joi.number().required(),
    });
    const { error, value } = schema.validate(pathParameters);
    if (error) {
      return { error: true, statusCode: 400, message: error.details[0].message };
    }
    // const data = exclude((await db.user.findUnique({ where: { id: value.id } })), ['password']);
    let data = await db.user.findUnique({ where: { id: value.id } });
    if (!data) {
      logger.info(`User not found with id: ${value.id}`);
      return { error: true, statusCode: 404, message: 'User not found' };
    }
    data = exclude(data, ['password']);
    logger.info('User found:', data);
    response = { data };
  } catch (error) {
    logger.error(error);
  }
  return response;
};

const createUser = async (event) => {
  const { db, logger, body } = event;
  let { response } = event;
  try {
    const schema = joi.object({
      email: joi.string().email().required(),
      name: joi.string().required(),
      password: joi.string().required(),
    });
    const { error, value } = schema.validate(body);
    if (error) {
      return { error: true, statusCode: 400, message: error.details[0].message };
    }

    const hash = crypto.SHA256(value.password).toString();
    value.password = hash;
    const data = exclude((await db.user.create({ data: value })), ['password']);
    if (!data) {
      return { error: true, statusCode: 400, message: 'There was an error creating user. Try again.' };
    }
    logger.info('User created:', data);
    response = { data };
  } catch (error) {
    const errorCodes = {
      P2002: {
        statusCode: 405,
        message: 'Email is already registered',
      },
    };
    if (errorCodes[error.code]) {
      response = { error: true, ...errorCodes[error.code] };
      logger.error(errorCodes[error.code]);
    } else {
      logger.error(JSON.stringify(error), error);
    }
  }
  return response;
};

const login = async (event) => {
  const { db, logger, body } = event;
  let { response } = event;

  try {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    const { error, value } = schema.validate(body);
    if (error) {
      return { error: true, statusCode: 400, message: error.details[0].message };
    }
    let valid = false;
    const data = await db.user.findUnique({ where: { email: value.email } });
    logger.info('User', data);
    if (data) {
      valid = (crypto.SHA256(value.password).toString() === data.password);
    }
    if (!valid) {
      response = { error: true, statusCode: 401, message: 'Email and/or password are incorrect' };
    } else {
      const token = jwt.signJWT(data);
      response = { message: 'Login correct', data: { access_token: token, token_type: 'Bearer' } };
    }
  } catch (error) {
    logger.error(JSON.stringify(error), error);
  }
  return response;
};

const updateUser = async (event) => {
  const {
    db, logger, body, pathParameters,
  } = event;
  let { response } = event;

  try {
    const schema = joi.object({
      id: joi.number().required(),
      email: joi.string(),
      name: joi.string(),
      password: joi.string(),
    });
    const input = { ...body, ...pathParameters };
    const { error, value } = schema.validate(input);
    if (error) {
      return { error: true, statusCode: 400, message: error.details[0].message };
    }
    const newUser = { ...value };
    if (value.password) {
      const hash = crypto.SHA256(value.password).toString();
      newUser.password = hash;
    } else {
      delete newUser.password;
    }
    const data = exclude((await db.user.update({ where: { id: newUser.id }, data: newUser })), ['password']);
    if (!data) {
      return { error: true, statusCode: 400, message: 'There was an error updating user. Try again.' };
    }
    response = { data };
  } catch (error) {
    logger.error(JSON.stringify(error), error);
    const errorCodes = {
      P2002: {
        statusCode: 405,
        message: 'Email is already registered',
      },
    };
    response = { error: true, ...errorCodes[error.code] };
  }
  return response;
};

const deleteUser = async (event) => {
  const {
    db, logger, pathParameters,
  } = event;
  let { response } = event;

  try {
    const schema = joi.object({
      id: joi.number().required(),
    });
    const { error, value } = schema.validate(pathParameters);
    if (error) {
      return { error: true, statusCode: 400, message: error.details[0].message };
    }
    const data = exclude((await db.user.delete({ where: { id: value.id } })), ['password']);
    if (!data) {
      return { error: true, statusCode: 400, message: 'There was an error deleting user. Try again.' };
    }
    response = { data };
  } catch (error) {
    logger.error(JSON.stringify(error), error);
  }
  return response;
};

module.exports = functions([
  getUsers,
  getUserById,
  createUser,
  login,
  updateUser,
  deleteUser,
]);

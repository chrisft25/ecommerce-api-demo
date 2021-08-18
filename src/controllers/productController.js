const joi = require('joi');
const { functions } = require('../middlewares');
const { exclude } = require('../lib/tools');

const getProducts = async (event) => {
  const { db, logger } = event;
  let { response } = event;
  try {
    const country = event.origin?.country || null;
    let geoCondition = {
      coverage: null,
    };
    if (country) {
      geoCondition = {
        OR: [
          {
            coverage: {
              contains: `-${country}-`,
            },
          },
          {
            coverage: null,
          },
        ],
      };
    }

    let data = await db.products.findMany({
      where: geoCondition,
      include: {
        images_products: true,
        prices_products: {
          where: geoCondition,
        },
        descriptions_products: {
          where: geoCondition,
        },
        reviews_products: {
          select: {
            review: true,
          },
        },
      },
    });

    data = data.map((e) => {
      const r = e;
      if (r.descriptions_products.length && r.descriptions_products[0].description) {
        r.description = e.descriptions_products[0].description;
      }
      if (r.prices_products.length && r.prices_products[0].price) {
        r.price = e.prices_products[0].price;
      }
      // eslint-disable-next-line max-len
      r.reviews = (r.reviews_products.reduce((accum, val) => accum + parseFloat(val.review), 0)) / e.reviews_products.length || 0;
      delete r.prices_products;
      delete r.reviews_products;
      delete r.descriptions_products;
      return r;
    });

    data = data.sort((a, b) => b.reviews - a.reviews);
    logger.info(data);
    response = data;
  } catch (error) {
    logger.error(error);
  }
  return response;
};

const getProductById = async (event) => {
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
    const data = await db.products.findUnique({ where: { id: value.id } });
    if (!data) {
      logger.info(`Product not found with id: ${value.id}`);
      return { error: true, statusCode: 404, message: 'Product not found' };
    }
    logger.info('Product found:', data);
    response = { data };
  } catch (error) {
    logger.error(error);
  }
  return response;
};

const createProduct = async (event) => {
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

const updateProduct = async (event) => {
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

const deleteProduct = async (event) => {
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
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
]);

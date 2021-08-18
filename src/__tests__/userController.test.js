const faker = require('faker');
const userController = require('../controllers/userController');

const timeout = 10000;

describe('Tests for Users', () => {
  const user = {
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: '12345',
  };

  const userEmailAlreadyRegistered = {
    email: user.email,
    name: faker.name.findName(),
    password: '12345',
  };

  test('User created successfully', () => userController.createUser({ body: user }, {}, null)
    .then((response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(body.error).toEqual(false);
      user.id = body.data.id;
    }), timeout);

  test('Invalid params to create user', () => userController.createUser({ body: { email: user.email } }, {}, null)
    .then((response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(400);
      expect(body.error).toEqual(true);
    }), timeout);

  test('Email is already registered', () => userController.createUser({ body: userEmailAlreadyRegistered }, {}, null)
    .then((response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(405);
      expect(body.error).toEqual(true);
    }), timeout);

  test('User can login', () => userController.login({ body: { email: user.email, password: user.password } }, {}, null)
    .then((response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(body.error).toEqual(false);
      expect(body.data.access_token).toBeDefined();
    }), timeout);

  test('Invalid credentials on login', () => userController.login({ body: { email: user.email, password: `${user.password}123` } }, {}, null)
    .then((response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(401);
      expect(body.error).toEqual(true);
    }), timeout);

  test('Users retrieved successfully', () => userController.getUsers({}, {}, null)
    .then((response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(body.error).toEqual(false);
    }), timeout);

  test('User info retrieved by ID sucessfully', () => userController.getUserById({ pathParameters: { id: user.id } }, {}, null)
    .then((response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(body.error).toEqual(false);
      expect(body.data.id).toEqual(user.id);
    }), timeout);

  test('User not found', () => userController.getUserById({ pathParameters: { id: -1 } }, {}, null)
    .then((response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(404);
      expect(body.error).toEqual(true);
    }), timeout);

  test('User updates sucessfully', () => userController.updateUser({ body: { ...user, name: `Update-${user.name}` } }, {}, null)
    .then((response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(body.error).toEqual(false);
      expect(body.data.name).toEqual(`Update-${user.name}`);
    }), timeout);

  test('User deletes sucessfully', () => userController.updateUser({ pathParameters: { id: user.id } }, {}, null)
    .then((response) => {
      const body = JSON.parse(response.body);
      expect(response.statusCode).toEqual(200);
      expect(body.error).toEqual(false);
    }), timeout);
});

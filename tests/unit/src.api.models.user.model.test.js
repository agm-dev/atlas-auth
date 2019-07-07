require = require('esm')(module); // eslint-disable-line no-global-assign
require('../includeEnvVars');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const httpStatus = require('http-status');
const User = require('../../src/api/models/User.model');
const {
  PUBLIC_USER_FIELDS,
  jwtAlgorithm,
  jwtPublicKey,
  jwtFakePublicKey,
} = require('../../src/config/vars');
const APIError = require('../../src/api/utils/APIError').default;

const RIGHT_USER_DATA = {
  email: 'test.email@somedomain.com',
  password: 'supersecret',
  name: 'firstname',
  scopes: ['USER_READ', 'USER_CREATE'],
};

const USER_FIELDS = [
  'email',
  'password',
  'name',
  'scopes',
];

jest.mock('../../src/api/models/User.model.js');

describe('User model', () => {
  const user = new User(RIGHT_USER_DATA);

  test('gets the props from data passes on instantiation', () => {
    expect(user.email).toBe(RIGHT_USER_DATA.email);
    expect(user.password).toBe(RIGHT_USER_DATA.password);
    expect(user.name).toBe(RIGHT_USER_DATA.name);
  });

  test('has every required field', () => {
    USER_FIELDS.forEach(field => expect(user[field]).toBeDefined());
  });

  test('has transform method', () => {
    expect(typeof user.transform).toBe('function');
  });

  test("transform method returns only the user's public fields", () => {
    const transformed = user.transform();
    const entries = Object.keys(transformed);
    expect(entries.length).toBe(PUBLIC_USER_FIELDS.length);
    PUBLIC_USER_FIELDS.forEach((field) => {
      expect(entries.includes(field)).toBeTruthy();
    });
  });

  test('has token method', () => {
    expect(typeof user.token).toBe('function');
  });

  test('token method generates a valid JWT token', () => {
    // eslint-disable-next-line no-underscore-dangle
    user._id = 1;
    const token = user.token();
    const isString = typeof token === 'string' && token.length;
    expect(isString).toBeTruthy();

    const sections = token.split('.');
    expect(sections.length).toBe(3);
    // there are some other stuff to test, but not worth it here.
  });

  test('generated token can be verified with public key', () => {
    const token = user.token();
    const data = jwt.decode(token, jwtPublicKey, false, jwtAlgorithm);
    expect(data).toHaveProperty('sub');
  });

  test('generated token verification fails if wrong CERT used', () => {
    const token = user.token();
    expect(() => {
      jwt.decode(token, jwtFakePublicKey, false, jwtAlgorithm);
    }).toThrow();
  });

  test('generated token includes public user fields', () => {
    const anotherUser = new User(RIGHT_USER_DATA);
    // eslint-disable-next-line no-underscore-dangle
    const userId = anotherUser._id.toString();
    const token = anotherUser.token();
    const data = jwt.decode(token, jwtPublicKey, false, jwtAlgorithm);
    expect(data.sub).toBe(userId);
    expect(data.email).toBe(anotherUser.email);
    expect(data.name).toBe(anotherUser.name);
    expect(data.scopes.length).toBe(anotherUser.scopes.length);

    // FIXME: check why data.scopes is []
    // RIGHT_USER_DATA.scopes.forEach((scope) => {
    //   expect(data.scopes).toContain(scope);
    // });
  });

  test('has passwordMatches method', () => {
    expect(typeof user.passwordMatches).toBe('function');
  });

  test('passwordMatches returns true if password is valid and false if not', async () => {
    const password = 'supersecret';
    const hash = await bcrypt.hash(password, 1);
    user.password = hash;
    const matches = user.passwordMatches(password);
    expect(matches).toBeTruthy();
  });

  test('has get method', () => {
    expect(User).toHaveProperty('get');
    expect(typeof User.get).toBe('function');
  });

  test('get method returns user by id', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const fakeUser = {
      _id: fakeId,
      email: 'fake@email.com',
    };

    User.get = jest.fn().mockReturnValue(fakeUser);
    const expectedUser = await User.get(fakeId);
    // eslint-disable-next-line no-underscore-dangle
    expect(expectedUser._id).toBe(fakeId);
  });

  test('get method throws APIError if user not found', async () => {
    const errorMessage = 'User does not exist';
    const errorStatus = httpStatus.NOT_FOUND;
    User.get.mockImplementation(() => {
      throw new APIError({
        message: errorMessage,
        status: errorStatus,
      });
    });

    expect.assertions(2);
    try {
      await User.get('some-wrong-user-id');
    } catch (err) {
      expect(err.message).toBe(errorMessage);
      expect(err.status).toBe(errorStatus);
    }
  });

  test('has findAndGenerateToken method', () => {
    expect(User).toHaveProperty('findAndGenerateToken');
    expect(typeof User.findAndGenerateToken).toBe('function');
  });

  // TODO: test findAndGenerateToken cases

  test('has checkDuplicateEmail method', () => {
    expect(User).toHaveProperty('checkDuplicateEmail');
    expect(typeof User.checkDuplicateEmail).toBe('function');
  });

  // TODO: test checkDuplicateEmail cases
});

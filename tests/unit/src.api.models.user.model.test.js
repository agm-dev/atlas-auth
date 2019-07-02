require = require('esm')(module); // eslint-disable-line no-global-assign
require('../includeEnvVars');
const bcrypt = require('bcryptjs');
const User = require('../../src/api/models/User.model');
const { PUBLIC_USER_FIELDS } = require('../../src/config/vars');

const RIGHT_USER_DATA = {
  email: 'test.email@somedomain.com',
  password: 'supersecret',
  name: 'firstname',
};

const USER_FIELDS = [
  'email',
  'password',
  'name',
  'scopes',
];

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
    // TODO:
  });

  test('generated token can be verified with public key', () => {
    // TODO:
  });

  test('generated token includes public user fields', () => {
    // TODO:
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
});

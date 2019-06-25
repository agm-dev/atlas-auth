require = require('esm')(module); // eslint-disable-line no-global-assign
const User = require('../../src/api/models/User.model');

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
});

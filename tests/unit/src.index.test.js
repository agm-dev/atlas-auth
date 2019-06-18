require = require('esm')(module); // eslint-disable-line no-global-assign
const { authRouter } = require('../../src/index');

test('exports authRouter', () => {
  expect(authRouter).toBeDefined();
  expect(authRouter).not.toBeNull();
  expect(authRouter).toBeDefined();
  expect(authRouter).not.toBeNull();
});

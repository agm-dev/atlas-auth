require = require('esm')(module); // eslint-disable-line no-global-assign
require('../includeEnvVars');
const router = require('../../src/api/routes/index');

test('exports router', () => {
  expect(router).toBeDefined();
  expect(router).not.toBeNull();
});

require = require('esm')(module); // eslint-disable-line no-global-assign
const {
  PERMISSIONS,
  RESOURCES,
  SCOPES,
  ALL_SCOPES,
} = require('../../src/config/scopes');

describe('scopes', () => {
  const scopeProperties = Object.keys(SCOPES);

  test('scopes are composed by resources', () => {
    RESOURCES.forEach((resource) => {
      const isIncluded = scopeProperties.includes(resource);
      expect(isIncluded).toBeTruthy();
    });
  });

  test('every resource in scopes has all permissions as key', () => {
    scopeProperties.forEach((resource) => {
      const resourceKeys = Object.keys(SCOPES[resource]);
      PERMISSIONS.forEach((permission) => {
        const isIncluded = resourceKeys.includes(permission);
        expect(isIncluded).toBeTruthy();
      });
    });
  });

  test('all_scopes includes the combination of every permission per resource, joined with _', () => {
    RESOURCES.forEach((resource) => {
      PERMISSIONS.forEach((permission) => {
        const value = `${resource}_${permission}`;
        const isIncluded = ALL_SCOPES.includes(value);
        expect(isIncluded).toBeTruthy();
      });
    });
  });
});

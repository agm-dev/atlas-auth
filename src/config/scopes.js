const PERMISSIONS = [
  'READ',
  'CREATE',
  'UPDATE',
  'DELETE',
];

const RESOURCES = [
  'USER',
];

const SCOPES = RESOURCES.reduce((result, resource) => {
  const scope = {};
  scope[resource] = {};
  PERMISSIONS.forEach((permission) => {
    const scopeValue = `${resource}_${permission}`;
    scope[resource][permission] = scopeValue;
  });
  return Object.assign({}, result, scope);
}, {});

const ALL_SCOPES = [];
const scopeResources = Object.keys(SCOPES);
scopeResources.forEach((resource) => {
  PERMISSIONS.forEach((permission) => {
    const scopeValue = SCOPES[resource][permission];
    ALL_SCOPES.push(scopeValue);
  });
});

export {
  PERMISSIONS,
  RESOURCES,
  SCOPES,
  ALL_SCOPES,
};

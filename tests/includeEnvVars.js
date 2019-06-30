const { join } = require('path');
const { load } = require('dotenv-safe');

load({
  path: join(__dirname, '..', '.env'),
  sample: join(__dirname, '..', '.env.example'),
});

require = require('esm')(module); // eslint-disable-line no-global-assign
const { server } = require('./src/index');

const PORT = 8888;
server.listen(PORT, () => console.log(`server listening on port ${PORT}`));

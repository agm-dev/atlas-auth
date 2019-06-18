import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: { // https://swagger.io/specification/#infoObjec
    openapi: '3.0.0',
    info: {
      title: 'Auth API', // TODO: read this from constants
      version: '1.0.0', // TODO: the same
      description: 'Routes for auth API', // TODO: the same
    },
  },
  apis: ['**/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;

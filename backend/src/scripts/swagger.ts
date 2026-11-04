const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My Express API',
    description: 'Automatically generated API documentation',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';

const endpointsFiles = ['./routes/users.js', './routes/products.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

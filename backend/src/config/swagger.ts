import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'ITC Hub API',
      version: '1.0.0',
      description: 'ITC Hub REST API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '665f1c2a8e4a6f0012345678' },
            name: { type: 'string', example: 'ITC Member' },
            email: { type: 'string', format: 'email', example: 'member@example.com' },
            role: { type: 'string', enum: ['member', 'admin'], example: 'member' },
          },
        },
        Event: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1c2a8e4a6f0012345678' },
            title: { type: 'string', example: 'Web Development Workshop' },
            description: { type: 'string', example: 'A practical workshop.' },
            location: { type: 'string', example: 'University of Blida' },
            date: { type: 'string', format: 'date-time' },
            image: { type: 'string', format: 'uri' },
            capacity: { type: 'integer', minimum: 1, example: 50 },
            registrationDeadline: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['upcoming', 'ongoing', 'completed', 'cancelled'] },
          },
        },
        ChatMessage: {
          type: 'object',
          required: ['role', 'content'],
          properties: {
            role: { type: 'string', enum: ['user', 'assistant'] },
            content: { type: 'string', example: 'What events are coming up?' },
          },
        },
      },
    },
  },
  apis: ['./src/app.ts', './src/modules/**/*.routes.ts', './src/modules/**/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

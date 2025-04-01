const swaggerJsdocBO = require('swagger-jsdoc');

const swaggerOptionsWebsitesCustomers = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Customers Documentation',
      version: '1.0.0',
      description: 'Documentation for the API',
    },
    servers: [
      {
        url: 'http://localhost:2001/api',
        description: 'Servidor local',
      },
      {
        url: 'https://api.code-fullstack.com/api',
        description: 'Servidor de produção',
      },
      
    ],
    components: {
      schemas: {
        Customer: {
          type: 'object',
          properties: {
            customerId: {
              type: 'string',
              description: 'ID of the customer',
            },
            name: {
              type: 'string',
              description: 'Name of the customer',
            },
            email: {
              type: 'string',
              description: 'Email of the customer',
            },
            contact: {
              type: 'string',
              description: 'Contact information of the customer (E.164 format)',
              example: '+1234567890',
            },
            photo: {
              type: 'string',
              description: 'Photo URL of the customer',
            },
          },
          required: ['customerId', 'name', 'email'], // Campos obrigatórios
        },
      },
    },
  },
  apis: ['./controllers/websites/customers/**/*.js'],
};

const swaggerSpecWebsitesCustomers = swaggerJsdocBO(swaggerOptionsWebsitesCustomers);

module.exports = { swaggerSpecWebsitesCustomers };
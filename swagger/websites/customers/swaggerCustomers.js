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
        Address: {
          type: 'object',
          properties: {
            addressId: {
              type: 'string',
              description: 'ID of the address',
            },
            address: {
              type: 'string',
              description: 'Street address of the customer',
            },
            postalCode: {
              type: 'string',
              description: 'Postal code of the address',
            },
            city: {
              type: 'string',
              description: 'City of the address',
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number associated with the address',
            },
            nif: {
              type: 'string',
              description: 'Tax identification number (NIF)',
            },
            addTaxpayer: {
              type: 'boolean',
              description: 'Indicates if the taxpayer is added',
            },
          },
          required: ['address', 'postalCode', 'city', 'phoneNumber', 'nif', 'addTaxpayer'], // Campos obrigatórios
        },
        BankCard: {
          type: 'object',
          properties: {
            cardId: {
              type: 'string',
              description: 'ID of the bank card',
            },
            cardNumber: {
              type: 'string',
              description: 'Card number',
            },
            expirationDate: {
              type: 'string',
              description: 'Expiration date of the card (MM/YY format)',
            },
            cvv: {
              type: 'string',
              description: 'CVV of the card',
            },
            customerId: {
              type: 'string',
              description: 'ID of the customer associated with the bank card',
            },
          },
          required: ['cardNumber', 'expirationDate', 'cvv', 'customerId'], // Campos obrigatórios
        },
      },
    },
  },
  apis: ['./controllers/websites/customers/**/*.js'],
};

const swaggerSpecWebsitesCustomers = swaggerJsdocBO(swaggerOptionsWebsitesCustomers);

module.exports = { swaggerSpecWebsitesCustomers };
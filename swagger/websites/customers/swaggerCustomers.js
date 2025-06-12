const swaggerJsdocBO = require("swagger-jsdoc");

const swaggerOptionsWebsitesCustomers = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Customers Documentation",
      version: "1.0.0",
      description: "Documentation for the API",
    },
    servers: [
      {
        url: "http://localhost:2001/api",
        description: "Servidor local",
      },
      {
        url: "https://api.code-fullstack.com/api",
        description: "Servidor de produção",
      },
    ],
    components: {
      schemas: {
        Customer: {
          type: "object",
          properties: {
            customerId: {
              type: "string",
              description: "ID of the customer",
            },
            name: {
              type: "string",
              description: "Name of the customer",
            },
            email: {
              type: "string",
              description: "Email of the customer",
            },
            contact: {
              type: "string",
              description: "Contact information of the customer (E.164 format)",
              example: "+1234567890",
            },
            photo: {
              type: "string",
              description: "Photo URL of the customer",
            },
          },
          required: ["customerId", "name", "email"], // Campos obrigatórios
        },
        Address: {
          type: "object",
          properties: {
            addressId: {
              type: "string",
              description: "ID of the address",
            },
            address: {
              type: "string",
              description: "Street address of the customer",
            },
            postalCode: {
              type: "string",
              description: "Postal code of the address (format: 1234-567)",
            },
            city: {
              type: "string",
              description: "City of the address",
            },
            phoneNumber: {
              type: "string",
              description:
                "Phone number associated with the address (E.164 format)",
            },
            nif: {
              type: "string",
              description: "Tax identification number (NIF, 9 digits)",
            },
            addTaxpayer: {
              type: "boolean",
              description: "Indicates if the taxpayer is added",
            },
            defaultAdress: {
              type: "boolean",
              description: "Indicates if this is the default address",
            },
            defaultAdressFaturation: {
              type: "boolean",
              description: "Indicates if this is the default billing address",
            },
            customerId: {
              type: "string",
              description: "ID of the customer associated with the address",
            },
          },
          required: ["address", "postalCode", "city", "phoneNumber"], // Campos obrigatórios
        },
        BankCard: {
          type: "object",
          properties: {
            cardId: {
              type: "string",
              description: "ID of the bank card",
            },
            cardNumber: {
              type: "string",
              description: "Card number",
            },
            expirationDate: {
              type: "string",
              description: "Expiration date of the card (MM/YY format)",
            },
            cvv: {
              type: "string",
              description: "CVV of the card",
            },
            customerId: {
              type: "string",
              description: "ID of the customer associated with the bank card",
            },
          },
          required: ["cardNumber", "expirationDate", "cvv", "customerId"], // Campos obrigatórios
        },
        LoginRequest: {
          type: "object",
          required: ["provider"],
          properties: {
            provider: {
              type: "string",
              enum: ["google", "credentials"],
              description: "Authentication provider",
            },
            idToken: {
              type: "string",
              description: 'Google ID Token (required if provider is "google")',
            },
            email: {
              type: "string",
              description:
                'Email address (required if provider is "credentials")',
            },
            password: {
              type: "string",
              description: 'Password (required if provider is "credentials")',
            },
          },
        },
      },
    },
  },
  apis: ["./controllers/websites/customers/**/*.js"],
};

const swaggerSpecWebsitesCustomers = swaggerJsdocBO(
  swaggerOptionsWebsitesCustomers
);

module.exports = { swaggerSpecWebsitesCustomers };

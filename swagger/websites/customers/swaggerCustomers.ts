import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptionsWebsitesCustomers: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Customers Documentation",
      version: "1.0.0",
      description: "Documentation for the API",
    },
    servers: [
      { url: "http://localhost:3306/api", description: "Servidor local" },
      {
        url: "https://api.rufvision.com/api",
        description: "Servidor de produção",
      },
    ],
    components: {
      schemas: {
        Customer: {
          type: "object",
          properties: {
            customerId: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            contact: { type: "string", example: "+1234567890" },
            photo: { type: "string" },
          },
          required: ["customerId", "name", "email"],
        },
        Address: {
          type: "object",
          properties: {
            addressId: { type: "string" },
            address: { type: "string" },
            postalCode: { type: "string" },
            city: { type: "string" },
            phoneNumber: { type: "string" },
            nif: { type: "string" },
            addTaxpayer: { type: "boolean" },
            defaultAdress: { type: "boolean" },
            defaultAdressFaturation: { type: "boolean" },
            customerId: { type: "string" },
          },
          required: ["address", "postalCode", "city", "phoneNumber"],
        },
        BankCard: {
          type: "object",
          properties: {
            cardId: { type: "string" },
            cardNumber: { type: "string" },
            expirationDate: { type: "string" },
            cvv: { type: "string" },
            customerId: { type: "string" },
          },
          required: ["cardNumber", "expirationDate", "cvv", "customerId"],
        },
        LoginRequest: {
          type: "object",
          required: ["provider"],
          properties: {
            provider: { type: "string", enum: ["google", "credentials"] },
            idToken: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./controllers/websites/customers/**/*.ts"],
};

export const swaggerSpecWebsitesCustomers = swaggerJsdoc(
  swaggerOptionsWebsitesCustomers,
);

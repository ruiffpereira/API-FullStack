import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptionsBackoffice: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API BackOffice Documentation",
      version: "1.0.0",
      description: "Documentation for the API",
    },
    servers: [
      { url: "http://localhost:3306/api", description: "Servidor local" },
      { url: "https://api.rufvision.com", description: "Servidor de produção" },
    ],
    components: {
      schemas: {
        Subcategory: {
          type: "object",
          properties: {
            subcategoryId: { type: "string" },
            name: { type: "string" },
            categoryId: { type: "string" },
          },
          required: ["subcategoryId", "name", "categoryId"],
        },
        Category: {
          type: "object",
          properties: {
            categoryId: { type: "string" },
            name: { type: "string" },
            subcategories: {
              type: "array",
              items: { $ref: "#/components/schemas/Subcategory" },
            },
          },
          required: ["categoryId", "name"],
        },
        Product: {
          type: "object",
          properties: {
            productId: { type: "string" },
            name: { type: "string" },
            price: { type: "number" },
            description: { type: "string" },
            categoryId: { type: "string" },
            subcategoryId: { type: "string" },
            stock: { type: "integer" },
            reference: { type: "string" },
            photos: { type: "array", items: { type: "string" } },
          },
          required: ["productId", "name", "price", "categoryId", "photos"],
        },
        Order: {
          type: "object",
          properties: {
            orderId: { type: "string" },
            userId: { type: "string" },
            customerId: { type: "string" },
            price: { type: "number", format: "decimal" },
            createdAt: { type: "string", format: "date-time" },
          },
          required: ["orderId", "userId", "customerId", "price"],
        },
        OrderProduct: {
          type: "object",
          properties: {
            orderProductId: { type: "string" },
            orderId: { type: "string" },
            productId: { type: "string" },
            quantity: { type: "integer" },
            price: { type: "number" },
          },
          required: [
            "orderProductId",
            "orderId",
            "productId",
            "quantity",
            "price",
          ],
        },
        User: {
          type: "object",
          properties: {
            userId: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            permissionId: { type: "string" },
          },
          required: ["userId", "name", "email", "permissionId"],
        },
        Permission: {
          type: "object",
          properties: {
            permissionId: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
          },
          required: ["permissionId", "name"],
        },
        Component: {
          type: "object",
          properties: {
            componentId: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            permissions: { type: "array", items: { type: "string" } },
          },
          required: ["componentId", "name"],
        },
        Customer: {
          type: "object",
          properties: {
            customerId: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            contact: { type: "string" },
            photo: { type: "string" },
          },
          required: ["customerId", "name", "email"],
        },
      },
    },
  },
  apis: ["./controllers/backoffice/**/*.ts"],
};

export const swaggerSpecBackoffice = swaggerJsdoc(swaggerOptionsBackoffice);

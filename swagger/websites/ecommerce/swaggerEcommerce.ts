import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptionsWebsitesEcommerce: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Website Ecommerce Documentation",
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
        Product: {
          type: "object",
          properties: {
            productId: { type: "string" },
            name: { type: "string" },
            price: { type: "number" },
            description: { type: "string" },
            photos: { type: "array", items: { type: "string" } },
            category: {
              type: "object",
              properties: {
                categoryId: { type: "string" },
                name: { type: "string" },
              },
            },
            subcategory: {
              type: "object",
              properties: {
                subcategoryId: { type: "string" },
                name: { type: "string" },
              },
            },
          },
          required: ["productId", "name", "price"],
        },
        Cart: {
          type: "object",
          properties: {
            cartId: { type: "string" },
            customerId: { type: "string" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "string" },
                  name: { type: "string" },
                  price: { type: "number" },
                  photos: { type: "array", items: { type: "string" } },
                  quantity: { type: "integer" },
                },
              },
            },
            shipPrice: { type: "number" },
          },
          required: ["cartId", "customerId", "products", "shipPrice"],
        },
        OrderProduct: {
          type: "object",
          properties: {
            orderProductId: { type: "string" },
            orderId: { type: "string" },
            productId: { type: "string" },
            quantity: { type: "integer" },
            priceAtPurchase: { type: "number" },
            product: { $ref: "#/components/schemas/Product" },
          },
          required: [
            "orderProductId",
            "orderId",
            "productId",
            "quantity",
            "priceAtPurchase",
          ],
        },
        Order: {
          type: "object",
          properties: {
            orderId: { type: "string", format: "uuid" },
            customerId: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            price: { type: "number", format: "float" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            orderProducts: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderProduct" },
            },
          },
          required: ["orderId", "customerId", "userId", "price"],
        },
      },
    },
  },
  apis: ["./controllers/websites/ecommerce/**/*.ts"],
};

export const swaggerSpecWebsitesEcommerce = swaggerJsdoc(
  swaggerOptionsWebsitesEcommerce,
);

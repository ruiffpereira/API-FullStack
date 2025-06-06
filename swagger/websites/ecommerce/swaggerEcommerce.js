const swaggerJsdocECM = require("swagger-jsdoc");

const swaggerOptionsWebsitesEcommerce = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Website Ecommerce Documentation",
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
        Product: {
          type: "object",
          properties: {
            productId: {
              type: "string",
              description: "ID of the product",
            },
            name: {
              type: "string",
              description: "Name of the product",
            },
            price: {
              type: "number",
              description: "Price of the product",
            },
            description: {
              type: "string",
              description: "Description of the product",
            },
            photos: {
              type: "array",
              description: "Photos of the product",
              items: {
                type: "string",
                description: "URL of the product photo",
              },
            },
            category: {
              type: "object",
              description: "Category of the product",
              properties: {
                categoryId: {
                  type: "string",
                  description: "ID of the category",
                },
                name: {
                  type: "string",
                  description: "Name of the category",
                },
              },
            },
            subcategory: {
              type: "object",
              description: "Subcategory of the product",
              properties: {
                subCategoryId: {
                  type: "string",
                  description: "ID of the subcategory",
                },
                name: {
                  type: "string",
                  description: "Name of the subcategory",
                },
              },
            },
          },
          required: ["productId", "name", "price"],
        },
        Cart: {
          type: "object",
          properties: {
            cartId: {
              type: "string",
              description: "ID of the cart",
            },
            customerId: {
              type: "string",
              description: "ID of the customer who owns the cart",
            },
            products: {
              type: "array",
              description: "List of products in the cart",
              items: {
                type: "object",
                properties: {
                  productId: {
                    type: "string",
                    description: "ID of the product",
                  },
                  name: {
                    type: "string",
                    description: "Name of the product",
                  },
                  price: {
                    type: "number",
                    description: "Price of the product",
                  },
                  photos: {
                    type: "array",
                    description: "Photos of the product",
                    items: {
                      type: "string",
                      description: "URL of the product photo",
                    },
                  },
                  quantity: {
                    type: "integer",
                    description: "Quantity of the product in the cart",
                  },
                },
              },
            },
            shipPrice: {
              type: "number",
              description: "Total price of the cart",
            },
          },
          required: ["cartId", "customerId", "products", "shipPrice"],
        },
        OrderProduct: {
          type: "object",
          properties: {
            orderProductId: {
              type: "string",
              description: "ID of the order-product relation",
            },
            orderId: {
              type: "string",
              description: "ID of the order",
            },
            productId: {
              type: "string",
              description: "ID of the product",
            },
            quantity: {
              type: "integer",
              description: "Quantity of the product in the order",
            },
            priceAtPurchase: {
              type: "number",
              description: "Price of the product at the time of purchase",
            },
            product: {
              $ref: "#/components/schemas/Product",
            },
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
            orderId: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the order",
            },
            customerId: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the customer",
            },
            userId: {
              type: "string",
              format: "uuid",
              description:
                "Unique identifier for the user who created the order",
            },
            price: {
              type: "number",
              format: "float",
              description: "Total price of the order",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the order was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the order was last updated",
            },
            orderProducts: {
              type: "array",
              description: "List of products in the order",
              items: {
                $ref: "#/components/schemas/OrderProduct",
              },
            },
          },
          required: ["orderId", "customerId", "userId", "price"],
        },
      },
    },
  },
  apis: ["./controllers/websites/ecommerce/**/*.js"], // Apenas controladores do Ecommerce
};

const swaggerSpecWebsitesEcommerce = swaggerJsdocECM(
  swaggerOptionsWebsitesEcommerce
);

module.exports = { swaggerSpecWebsitesEcommerce };

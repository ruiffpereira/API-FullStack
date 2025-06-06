const swaggerJsdocBO = require("swagger-jsdoc");

const swaggerOptionsBackoffice = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API BackOffice Documentation",
      version: "1.0.0",
      description: "Documentation for the API",
    },
    servers: [
      {
        url: "http://localhost:2001/api",
        description: "Servidor local",
      },
      {
        url: "https://api.code-fullstack.com",
        description: "Servidor de produção",
      },
    ],
    components: {
      schemas: {
        Subcategory: {
          type: "object",
          properties: {
            subcategoryId: {
              type: "string",
              description: "ID of the subcategory",
            },
            name: {
              type: "string",
              description: "Name of the subcategory",
            },
            categoryId: {
              type: "string",
              description: "ID of the associated category",
            },
          },
          required: ["subcategoryId", "name", "categoryId"],
        },
        Category: {
          type: "object",
          properties: {
            categoryId: {
              type: "string",
              description: "ID of the category",
            },
            name: {
              type: "string",
              description: "Name of the category",
            },
            subcategories: {
              type: "array",
              description: "List of subcategories associated with the category",
              items: {
                $ref: "#/components/schemas/Subcategory",
              },
            },
          },
          required: ["categoryId", "name"],
        },
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
            categoryId: {
              type: "string",
              description: "ID of the associated category",
            },
            subcategoryId: {
              type: "string",
              description: "ID of the associated subcategory",
            },
            stock: {
              type: "integer",
              description: "Stock quantity of the product",
            },
            reference: {
              type: "string",
              description: "Reference code of the product",
            },
            photos: {
              type: "array",
              description: "List of photo URLs of the product",
              items: {
                type: "string",
              },
            },
          },
          required: ["productId", "name", "price", "categoryId", "photos"],
        },
        Order: {
          type: "object",
          properties: {
            orderId: {
              type: "string",
              description: "ID of the order",
            },
            userId: {
              type: "string",
              description: "ID of the user who created the order",
            },
            customerId: {
              type: "string",
              description: "ID of the customer who placed the order",
            },
            price: {
              type: "number",
              description: "Total price of the order",
              format: "decimal",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date and time when the order was created",
            },
          },
          required: ["orderId", "userId", "customerId", "price"],
        },
        OrderProduct: {
          type: "object",
          properties: {
            orderProductId: {
              type: "string",
              description: "ID of the order-product relationship",
            },
            orderId: {
              type: "string",
              description: "ID of the associated order",
            },
            productId: {
              type: "string",
              description: "ID of the associated product",
            },
            quantity: {
              type: "integer",
              description: "Quantity of the product in the order",
            },
            price: {
              type: "number",
              description: "Price of the product in the order",
            },
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
            userId: {
              type: "string",
              description: "ID of the user",
            },
            name: {
              type: "string",
              description: "Name of the user",
            },
            email: {
              type: "string",
              description: "Email of the user",
            },
            permissionId: {
              type: "string",
              description: "ID of the associated permission",
            },
          },
          required: ["userId", "name", "email", "permissionId"],
        },
        Permission: {
          type: "object",
          properties: {
            permissionId: {
              type: "string",
              description: "ID of the permission",
            },
            name: {
              type: "string",
              description: "Name of the permission",
            },
            description: {
              type: "string",
              description: "Description of the permission",
            },
          },
          required: ["permissionId", "name"],
        },
        Component: {
          type: "object",
          properties: {
            componentId: {
              type: "string",
              description: "ID of the component",
            },
            name: {
              type: "string",
              description: "Name of the component",
            },
            description: {
              type: "string",
              description: "Description of the component",
            },
            permissions: {
              type: "array",
              items: {
                type: "string",
                description: "List of associated permission IDs",
              },
            },
          },
          required: ["componentId", "name"],
        },
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
              description: "Contact information of the customer",
            },
            photo: {
              type: "string",
              description: "Photo URL of the customer",
            },
          },
          required: ["customerId", "name", "email"],
        },
      },
    },
  },
  apis: ["./controllers/backoffice/**/*.js"], // Apenas controladores do backoffice
};

const swaggerSpecBackoffice = swaggerJsdocBO(swaggerOptionsBackoffice);

module.exports = { swaggerSpecBackoffice };

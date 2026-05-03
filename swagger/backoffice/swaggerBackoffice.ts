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
        Service: {
          type: "object",
          properties: {
            serviceId: { type: "string" },
            name: { type: "string" },
            duration: { type: "integer", description: "Duração em minutos" },
            price: { type: "number" },
            description: { type: "string" },
            active: { type: "boolean" },
          },
          required: ["serviceId", "name", "duration", "price"],
        },
        Appointment: {
          type: "object",
          properties: {
            appointmentId: { type: "string" },
            date: { type: "string", example: "2026-05-15" },
            time: { type: "string", example: "10:00" },
            serviceId: { type: "string" },
            clientName: { type: "string" },
            clientEmail: { type: "string" },
            clientPhone: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "completed", "cancelled"],
            },
            notes: { type: "string" },
          },
          required: ["appointmentId", "date", "time", "serviceId", "clientName", "clientEmail", "clientPhone"],
        },
        WorkingHours: {
          type: "object",
          properties: {
            workingHoursId: { type: "string" },
            dayOfWeek: { type: "integer", description: "0=Dom, 1=Seg, ..., 6=Sáb" },
            startTime: { type: "string", example: "09:00" },
            endTime: { type: "string", example: "18:00" },
            isActive: { type: "boolean" },
          },
          required: ["dayOfWeek", "startTime", "endTime"],
        },
        BlockedSlot: {
          type: "object",
          properties: {
            blockedSlotId: { type: "string" },
            date: { type: "string", example: "2026-05-01" },
            startTime: { type: "string", example: "12:00", nullable: true },
            endTime: { type: "string", example: "14:00", nullable: true },
            reason: { type: "string", nullable: true },
          },
          required: ["blockedSlotId", "date"],
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

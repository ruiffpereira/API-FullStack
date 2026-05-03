import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptionsWebsitesBooking: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Booking — Agendamentos Públicos",
      version: "1.0.0",
      description:
        "API pública de agendamentos. Funciona para qualquer tipo de prestador de serviços: barbearias, cabeleireiros, estética, stands, etc. O prestador é identificado pelo `userId`.",
    },
    servers: [
      { url: "http://localhost:3001/api", description: "Servidor local" },
      { url: "https://api.rufvision.com/api", description: "Servidor de produção" },
    ],
    components: {
      schemas: {
        Service: {
          type: "object",
          properties: {
            serviceId: { type: "string", format: "uuid" },
            name: { type: "string", example: "Corte de cabelo" },
            price: { type: "number", example: 15 },
            duration: { type: "integer", description: "Duração em minutos", example: 30 },
            description: { type: "string", nullable: true },
          },
          required: ["serviceId", "name", "price", "duration"],
        },
        CreateAppointmentRequest: {
          type: "object",
          required: ["userId", "serviceId", "date", "time", "clientName", "clientEmail", "clientPhone"],
          properties: {
            userId: { type: "string", format: "uuid", description: "ID do prestador de serviço" },
            serviceId: { type: "string", format: "uuid" },
            date: { type: "string", format: "date", example: "2025-06-15" },
            time: { type: "string", example: "10:00" },
            clientName: { type: "string", example: "João Silva" },
            clientEmail: { type: "string", format: "email" },
            clientPhone: { type: "string", example: "+351912345678" },
            notes: { type: "string", nullable: true },
          },
        },
        AppointmentCreated: {
          type: "object",
          properties: {
            appointmentId: { type: "string", format: "uuid" },
            date: { type: "string", format: "date" },
            time: { type: "string" },
            serviceName: { type: "string" },
            duration: { type: "integer" },
            price: { type: "number" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "completed", "cancelled"],
            },
          },
        },
        AppointmentDetail: {
          type: "object",
          properties: {
            appointmentId: { type: "string", format: "uuid" },
            date: { type: "string", format: "date" },
            time: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "completed", "cancelled"],
            },
            clientName: { type: "string" },
            service: {
              type: "object",
              properties: {
                name: { type: "string" },
                duration: { type: "integer" },
                price: { type: "number" },
              },
            },
          },
        },
      },
    },
    paths: {
      "/websites/booking/services": {
        get: {
          summary: "Listar serviços activos do prestador",
          operationId: "getBookingServices",
          tags: ["Booking"],
          parameters: [
            {
              name: "userId",
              in: "query",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do prestador de serviço no sistema",
            },
          ],
          responses: {
            "200": {
              description: "Lista de serviços activos",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Service" } },
                },
              },
            },
            "400": { description: "userId obrigatório" },
            "500": { description: "Erro interno" },
          },
        },
      },
      "/websites/booking/slots": {
        get: {
          summary: "Obter horários disponíveis para uma data e serviço",
          operationId: "getBookingSlots",
          tags: ["Booking"],
          parameters: [
            { name: "userId", in: "query", required: true, schema: { type: "string", format: "uuid" } },
            { name: "date", in: "query", required: true, schema: { type: "string", format: "date" }, description: "Formato YYYY-MM-DD" },
            { name: "serviceId", in: "query", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            "200": {
              description: "Lista de horários livres, ex: ['09:00', '09:30', '10:00']",
              content: {
                "application/json": {
                  schema: { type: "array", items: { type: "string", example: "09:30" } },
                },
              },
            },
            "400": { description: "Parâmetros obrigatórios em falta" },
            "404": { description: "Serviço não encontrado" },
            "500": { description: "Erro interno" },
          },
        },
      },
      "/websites/booking/appointments": {
        post: {
          summary: "Criar nova marcação",
          operationId: "postBookingAppointment",
          tags: ["Booking"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateAppointmentRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Marcação criada. Um email de confirmação com link de cancelamento é enviado ao cliente.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AppointmentCreated" },
                },
              },
            },
            "400": { description: "Campos obrigatórios em falta" },
            "404": { description: "Serviço não encontrado" },
            "409": { description: "Horário já não está disponível" },
            "500": { description: "Erro interno" },
          },
        },
      },
      "/websites/booking/appointments/{cancelToken}": {
        get: {
          summary: "Consultar marcação pelo token de cancelamento",
          operationId: "getBookingAppointmentByToken",
          tags: ["Booking"],
          parameters: [
            {
              name: "cancelToken",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Token único enviado no email de confirmação",
            },
          ],
          responses: {
            "200": {
              description: "Detalhe da marcação",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AppointmentDetail" },
                },
              },
            },
            "404": { description: "Marcação não encontrada" },
            "500": { description: "Erro interno" },
          },
        },
      },
      "/websites/booking/appointments/{cancelToken}/cancel": {
        patch: {
          summary: "Cancelar uma marcação",
          operationId: "patchBookingAppointmentCancel",
          tags: ["Booking"],
          parameters: [
            {
              name: "cancelToken",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": {
              description: "Marcação cancelada. Email de confirmação enviado ao cliente.",
              content: {
                "application/json": {
                  schema: { type: "object", properties: { message: { type: "string" } } },
                },
              },
            },
            "400": { description: "Marcação já cancelada ou concluída" },
            "404": { description: "Marcação não encontrada" },
            "500": { description: "Erro interno" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpecWebsitesBooking = swaggerJsdoc(swaggerOptionsWebsitesBooking);

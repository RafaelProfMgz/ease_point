const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Ponto API",
      version: "1.0.0",
      description: "API para gestão de empresas e pontos",
      contact: {
        name: "Suporte",
      },
    },
    servers: [
      {
        url: "https://ease-point.onrender.com",
        description: "Servidor Local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/routes/*.js", "./src/docs/*.swagger.js"],
};

const specs = swaggerJsDoc(options);

module.exports = specs;

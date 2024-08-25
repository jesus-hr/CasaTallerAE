const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de casatallerae',
      version: '1.0.0',
      description: 'Documentación de la API',
    },
  },
  apis: ['./routes/*.js'], // Asegúrate de que esta ruta sea correcta
});

// Exportar la especificación y el middleware
module.exports = {
  swaggerSpec,
  swaggerUi
};
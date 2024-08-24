const swaggerJsdoc = require('swagger-jsdoc');

// Configuración de Swagger
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

module.exports = swaggerSpec;
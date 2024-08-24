const swaggerJsdoc = require('swagger-jsdoc');

// Configuración de la especificación Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de casatallerae',
      version: '1.0.0',
      description: 'Documentación de la API',
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor de API'
      }
    ],
  },
  apis: ['./routes/usuario.js'], // Asegúrate de que esta ruta sea correcta
});

module.exports = swaggerSpec;
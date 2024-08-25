const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const { swaggerSpec, swaggerUi } = require('./swagger');
const path = require('path');
const basicAuth = require('express-basic-auth');

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuario'));
//app.use('/api/productos', require('./routes/producto'));

// Autenticación básica para Swagger
app.use('/api-docs', basicAuth({
  users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD }, // Cambia estos valores por tu usuario y contraseña
  challenge: true,
  unauthorizedResponse: 'Unauthorized'
}), swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servir swagger.json
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Servir Swagger UI estático
app.use('/swagger-ui', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));

// Configurar el puerto y escuchar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
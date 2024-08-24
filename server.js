const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const swaggerSpec = require('./swagger'); // Asegúrate de que esta ruta es correcta
const swaggerUi = require('swagger-ui-express');

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuario'));
// Otras rutas...

// Rutas de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configurar el puerto y escuchar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
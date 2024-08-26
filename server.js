const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const { swaggerSpec, swaggerUi } = require('./swagger');
const path = require('path');
//const basicAuth = require('express-basic-auth');

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Middleware para autenticar cada solicitud a Swagger
const requireAuth = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Documentation"');
    return res.status(401).send('Authentication required.');
  }
  const auth = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const password = auth[1];
  if (user === "loquiero"/* process.env.SWAGGER_USER */ && password === "@lotengo304."/* process.env.SWAGGER_PASSWORD */) {
    return next();
  }
  return res.status(403).send('Error de autenticación');
};

// Autenticación básica para Swagger
/*app.use('/api-docs', basicAuth({
  users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD }, // Cambia estos valores por tu usuario y contraseña
  challenge: true,
  unauthorizedResponse: 'Unauthorized'
}), swaggerUi.serve, swaggerUi.setup(swaggerSpec));*/

// Rutas de Swagger
app.use('/api-docs', requireAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

if (app.use('/api', requireAuth)) {
  app.get('/api', requireAuth, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send();
  });
} else if(app.use('/api-docs', requireAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec))) {  
  // Servir swagger.json
  app.get('/api-docs', requireAuth, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

// Servir Swagger UI estático
app.use('/swagger-ui', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuario'));
app.use('/api/productos', require('./routes/producto'));

// Configurar el puerto y escuchar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
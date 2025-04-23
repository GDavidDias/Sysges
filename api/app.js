const express = require('express');
const cors = require('cors');
const documentosRoutes = require('./src/routes/documentos.routes.js');
const movimientosRoutes = require('./src/routes/movimientos.routes.js');
// const telefonoRoutes = require('./src/routes/telefono.routes.js');
// const titulosRoutes = require('./src/routes/titulos.routes.js');
 const userRoutes = require('./src/routes/user.routes.js');

const app = express();

//Configuracion de Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//HABILITO CORS
app.use(cors());

//rutas
app.use('/api',userRoutes);
app.use('/api',documentosRoutes);
app.use('/api',movimientosRoutes);
// app.use('/api',telefonoRoutes);
// app.use('/api',titulosRoutes);


module.exports = app;
const express = require('express');
const path = require('path')
const app = express()

// Carpeta publica
app.use(express.static(path.join(__dirname, '../public')))

// ejs
app.set('view engine', 'ejs');
app.set('views', './src/views');

// routes
const homeRouter = require(path.join(__dirname, 'routes/home.js'))

app.listen(3030, ()=> console.log('Servidor montado en el puerto 3030'))

app.use('/', homeRouter)
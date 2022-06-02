const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const router = require('./routes');
const passport = require('./config/passport');
//Configuracion y modelo bd
const db = require('./config/db');
const session = require('express-session');
    require('./models/Usuarios');
    db.sync().then(() => console.log('DB Conectada')).catch((error) => console.log(error));
//Variables de desarrollo
require('dotenv').config({path: 'variables.env'});

//Aplicacion principal
const app = express();

app.use(expressValidator());

//Body parser
//app.use(bodyParser.json);
app.use(bodyParser.urlencoded({extended: true}));

//Habilitar EJS como template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Ubicacion vistas
app.set('views', path.join(__dirname, './views'));

//archivos estaticos
app.use(express.static('public'));

//HAbilitar cookie parser
app.use(cookieParser());

//Crear sesion
app.use(session({
    secret:process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}))

//Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//Agrega flash messages
app.use(flash());

//Middleware (usuario logueado, flash messages, fecha actual)
app.use((req, res, next) =>{
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});
//routing
app.use('/', router());
app.listen(process.env.PORT, () => {
    console.log('El servidor esta funcionando');
});
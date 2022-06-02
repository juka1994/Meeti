const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

module.exports = function() {
    router.get('/', homeController.home);

    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar-cuenta/:correo', usuariosController.confirmarCuenta);

    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //Panel administrador
    router.get('/administracion', adminController.panelAdministracion);

    return router;
}

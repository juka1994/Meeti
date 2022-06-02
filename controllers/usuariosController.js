const { redirect } = require('express/lib/response');
const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) =>{
    res.render('crear-cuenta',{
        nombrePagina: 'Crear cuenta'
    })
}

exports.crearCuenta = async (req, res) =>{
    const usuario = req.body;

    req.checkBody('repetir', 'El password confirmado no puede ir vacio').notEmpty();
    req.checkBody('repetir', 'El password es diferente').equals(req.body.password);

    const erroresExpress = req.validationErrors();
       try {
           await Usuarios.create(usuario);
           //Url de confirmacion
           const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

           //Enviar email de confirmacion
           await enviarEmail.enviarEmail({
               usuario,
               url,
               subject: 'Confirma tu cuenta de Meeti',
               archivo: 'confirmar-cuenta'
           })
           //Todo correcto
           req.flash('exito', 'Hemos enviando un Email, confirma tu cuenta');
           res.redirect('/iniciar-sesion');
       } catch (error) {
           //Errores sequelize
           const errorSequelize = error.errors.map(err => err.message);
           //Errores express validator
           const ErrExp = erroresExpress.map(err => err.msg);
            //Unirlos a un arreglo 
           const listErr = [...errorSequelize,...ErrExp];
           req.flash('error', listErr);
           res.redirect('/crear-cuenta');
       }
}
//Confirmar
exports.confirmarCuenta = async (req, res) =>{
    //verificar que el usuario existe
    const usuario = await Usuarios.findOne({where: {email: req.params.correo}});

    //sino existe, redirecciones
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/crear-cuenta');
        return next();
    }
    console.log(usuario.activo);
    //Si existe, confirmar 
    usuario.activo = 1;
    await usuario.save();

    req.flash('exito', 'La cuenta se ha confirmado, ya puedes iniciar sesión');
    res.redirect('/iniciar-sesion');
}

exports.formIniciarSesion = (req, res) =>{
    res.render('iniciar-sesion',{
        nombrePagina: 'Iniciar sesion'
    })
}
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');
const fs = require('fs');
const util = require('util');
const ejs = require('ejs');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth:{
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

exports.enviarEmail = async(opciones) =>{
    console.log(opciones);

    //leer el archivo para el email
    const archivo = __dirname + `/../views/emails/${opciones.archivo}.ejs`;

    //compilarlo
    const compilado = ejs.compile(fs.readFileSync(archivo, 'utf-8'));

    //crear el HTML
    const html = compilado({url: opciones.url});

    //Configurar las opciones del email
    const opcionesEmail = {
        from: 'Meet <noreply@meeti.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        html: html
    }

    //enviar el mail
    const sendEmail = util.promisify(transport.sendMail, transport);
    return sendEmail.call(transport, opcionesEmail);
}
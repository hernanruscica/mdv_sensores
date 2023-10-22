const nodemailer = require('nodemailer');
const fechas = require('../utils/fechas');

module.exports = {
    // Crear una función para enviar un correo electrónico
    sendWelcome: (data, token) => {
        console.log("enviando mail")
        // Configurar el servicio de correo electrónico
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {                
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls : { rejectUnauthorized: false }
        });    
        // Definir los detalles del correo electrónico
        let mailOptions = {
            from: 'info@ruscica-code.ar',
            to: 'cesarhernanruscica@gmail.com',//aca deberia ir data.email
            subject: 'Registrado - ABM users API',
            html: ` <div style="font-size: 1rem">
                        <h1>ABM users API</h1>
                        <p>Hola <strong>${data.name}</strong>, bienvenido!</p>
                        <p>Se registro exitosamente en <strong>ABM users API</strong><br>
                        Ahora puede <a href="${process.env.APP_URL}:3001/api/users/login/">Ingresar a su perfil</a><br>
                        Tambien puede aprender a usar la API <a href="${process.env.APP_URL}:3001/api/info/">haciendo click aca.</a>
                        </p>
                        <p style="word-break: break-all;">
                            <strong>Su Token para acceder a la API es:  </strong><br>
                            ${token}                            
                        </p>
                        <p>
                            La misma expira en 24 Hs.
                        </p>

                    </div>
                    `
            };    
        // Enviar el correo electrónico
        transporter.sendMail(mailOptions);
    },
    sendActivation: async (data, token) => {
        console.log("enviando mail")

        const maniana = fechas.obtenerFechaYHora24Horas();
        
        // Definir los detalles del correo electrónico
        let mailOptions = {
            from: 'info@ruscica-code.ar',
            to: 'cesarhernanruscica@gmail.com',//aca deberia ir data.email
            subject: 'Verificando correo - MDV Sensores',
            html: ` <div style="font-size: 1rem">
                        <h1>Verificando correo - MDV Sensores</h1>
                        <p>Hola <strong>${data.nombre_1} ${data.apellido_1}</strong> !</p>

                        <p>Para el registro como usuario de <strong>MDV sensores</strong>, le enviamos este correo como paso <b>obligatorio </b>
                        para verificar su dirección de correo electrónico.</p>                        

                        <p>
                            Tiene que hacer click en este enlace de abajo, que lo llevará a la página de verificación de su correo.
                        </p>
                        <a href="${process.env.APP_URL}/users/activate/${token}">VERIFICAR CORREO ELECTRÓNICO</a>.
                        <p>
                            Tiene tiempo hasta ${maniana}, pasado ese tiempo deberá comunicarse con MDV sensores.
                        </p>
                    </div>
                    `
            };    
        // Enviar el correo electrónico
        try {
            // Configurar el servicio de correo electrónico
            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST ,
                port: process.env.EMAIL_PORT,
                secure: false,
                auth: {                
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                tls : { rejectUnauthorized: false }
            });
        
            const results = await transporter.sendMail(mailOptions);
            console.log("Correo enviado (despues del try)", results);
        } catch (error) {
            console.error('Error sending email with the token', error);
        }
        
        // Captura excepciones no manejadas globalmente
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err);
            // Puedes realizar acciones adicionales aquí, como cerrar el servidor o registrar el error.
        });
        
    }      
}
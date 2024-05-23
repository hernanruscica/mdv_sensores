const nodemailer = require('nodemailer');
const fechas = require('../utils/fechas');

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

module.exports = {
    // Crear una función para enviar un correo electrónico
    sendWelcome: async (data, token) => {
        
        // Definir los detalles del correo electrónico
        let mailOptions = {
            from: 'info@ruscica-code.ar',
            to: `${data.email}, chernana80@gmail.com, derf2cvd@yaaho.com`,
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
        const results = await transporter.sendMail(mailOptions);
        //console.log(results);
        if (results.rejected.length == 0){
            console.log('Correo enviado correctamente!');
            return true;
        }else{
            return false;
        }
    },
    sendActivation: async (data, token) => {       
        const maniana = fechas.obtenerFechaYHora24Horas();        
        // Definir los detalles del correo electrónico
        let mailOptions = {
            from: 'info@ruscica-code.ar',
            to: `${data.email}`,
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
            const results = await transporter.sendMail(mailOptions);
            console.log(`Correo enviado a ${mailOptions.to}!`);
        } catch (error) {
            console.error('Error sending email with the token', error);
        }
        
        // Captura excepciones no manejadas globalmente
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err);
            // Puedes realizar acciones adicionales aquí, como cerrar el servidor o registrar el error.
        });        
    },
    sendAlarm: async (avg, alarma, emailsString) => {
        console.log("enviando mail de alarma")       
        
        // Definir los detalles del correo electrónico
        let mailOptions = {
            from: 'info@ruscica-code.ar',
            to: emailsString,
            subject: 'ALARMA ! - MDV Sensores',
            html: ` <div style="font-size: 1rem">
                        <h1>Correo Alarma - MDV Sensores</h1>                        
                        <h2>Se disparo la  alarma <em>"${alarma.nombre}"</em>.</h2>                        
                        <p>
                            El sensor registro un cambio en los valores criticos.
                        </p>                       
                        <p>
                            El porcentaje de encendido supero el Max de ${alarma.max}, en: ${avg} en ${alarma.periodo_tiempo}
                        </p>                        
                    </div>
                    `
            };    
        // Enviar el correo electrónico
        try {                    
            // Enviar el correo electrónico
            const results = await transporter.sendMail(mailOptions);
            //console.log(results);
            if (results.rejected.length == 0){
                console.log('Correo enviado correctamente!');
                return true;
            }else{
                return false;
        }
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
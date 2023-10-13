const UserModel = require('../models/UserModel');
const mail = require('../utils/mail');
const bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const saltRounds = 10; // Número de rondas de sal para bcrypt


module.exports = {
    add: async (req, res) => {
        console.log('add User', req.body.nombre_1);

        // Hashear el password antes de guardarlo en la base de datos
        //const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Preparar el objeto de datos con el password hasheado
        const userData = {
            nombre_1: req.body.nombre_1,
            nombre_2: req.body.nombre_2 || null,
            apellido_1: req.body.apellido_1,
            apellido_2: req.body.apellido_2 || null,  
            dni: req.body.dni,
            foto: req.body.foto || null,
            email: req.body.email,
            password:  null, // Guarda el password hasheado en la base de datos
            telefono: req.body.telefono,
            estado: req.body.estado || 0,
            //fecha_creacion: req.body.fecha_creacion || '2023-10-12',
            direcciones_id: req.body.direcciones_id || 1
        };

        const userToken = jwt.sign({dni: userData.dni}, process.env.SECRET_KEY, {expiresIn: 86400}); //expira en un dia
        //console.log(userData);

        await UserModel.insert(userData)
        .then((results) => {
            // Realizar acciones de éxito aquí si es necesario          
            if (results.affectedRows > 0){
                delete userData.password;
                console.log("Inserción exitosa:", userData);
                //mail.sendWelcome(data, token);                
                res.render('dashboard', {results: 'registrocorrecto', 
                                        message: `Se registró correctamente, se envió un correo de activacion a la direccion: ${userData.email}`,
                                        user: req.session.user});
                mail.sendActivation(userData, userToken);
            }
        })
        .catch((error) => {
            // Manejar el error y enviar una respuesta HTTP aquí
            console.error(`Error en la inserción: ${error}`);
            if (error.code == 'ER_DUP_ENTRY'){                    
                console.log('No se inserto correctamente, atributos unicos, ya insertados en la tabla.', userData);                  
                res.render('dashboard', {results: 'registrofallido', 
                                        message: `No se registró correctamente, dni: ${userData.dni} o correo: ${userData.email} ya existen en la Base de datos`,
                                        user: req.session.user});               

            }else {
                console.log('Error al insertar el registro en la tabla de la Base de datos', userData);                       
                res.render('dashboard', {results: 'registrofallido', 
                                        message: `Ocurrió un error al registrar el usuario ${userData.nombre_1} ${userData.apellido_1} en la base de datos.`,
                                        user: req.session.user});                             
            }                    
        });

    },    
    activate: async (req, res) => {
        const userToken  = req.params.userToken;        

        try {
            const decodedToken = jwt.verify(userToken, process.env.SECRET_KEY);
            // Hacer algo con el token decodificado

            const userDni = decodedToken.dni
            console.log(`Activate acount with dni: ${userDni} and userToken: ${userToken}`);

            //const userDataBD = await getByDni() //falta revisar que si existe ese dni en la BD
            const results = await UserModel.updateState(userDni, 1);
            
            if (results.affectedRows > 0){
                console.log('usuario encontrado por dni y en estado "activo"');
                res.render('home', {results: 'activacioncorrecta', 
                                    message: 'Cuenta de usuario activada correctamente, ahora tiene que definir una contrasenia', 
                                    user: req.session.user});
            }else{
                console.log('usuario NO encontrado por dni');
                res.render('home', {results: 'activacioncorrecta', 
                                    message: 'Cuenta de usuario NO activada, se produjo un error', 
                                    user: req.session.user});
            }

          } catch (error) {
            // Manejar el error relacionado con el token
            if (error instanceof jwt.JsonWebTokenError) {
              console.error('Token inválido:', error.message);
              res.render('home', {results: 'activacionfallida', message: 'Token Invalido', user: req.session.user});

            } else if (error instanceof jwt.TokenExpiredError) {
              console.error('Token expirado:', error.message);
              res.render('home', {results: 'activacionfallida', message: 'Token vencido', user: req.session.user});             
              
            } else {
              // Manejar otros tipos de errores
              console.error('Error al verificar el token:', error.message);
              res.render('home', {results: 'activacionfallida', message: 'Error al verificar el Token', user: req.session.user});              
              
            }
          }
          



        

    },
    registerForm: (req, res) => {
      console.log("registerUserForm");      
      res.render('registerUserForm', {user: req.session.user});      
    },
    authenticate: async (req, res) => {
        const userData = {
            dni: parseInt(req.body.dni),
            password: req.body.password
        }
        console.log(typeof userData.dni, typeof userData.password);
        const  results = await UserModel.getByDni(userData.dni);
        const userDataBD = results[0];
        let userExists =  (results.length > 0) ? true : false;
        if (userExists){
                console.log("usuario encontrado!", userDataBD.nombre_1, userDataBD.dni, userDataBD.password);
                const passwordMatch = await bcrypt.compare(userData.password, userDataBD.password);
                console.log(passwordMatch ? 'Password correcta - Iniciar sesion' : 'Password Incorrecta');
                
                if (passwordMatch){
                    req.session.user = {
                        dni: userDataBD.dni,
                        nombre_1: userDataBD.nombre_1,
                        apellido_1: userDataBD.apellido_1,
                        email: userDataBD.email,
                        estado: userDataBD.estado
                    };
                    res.redirect('/users/dashboard');
                }else{
                    console.log("Contrasenia incorrecta!");
                    res.redirect('/loginForm')
                }                                
            }
        else{
            console.log("usuario NO encontrado!");
            res.redirect('/loginForm');
        }
    },
    dashboard: (req, res) => {
        console.log("dashboard");
        if (req.session.user !== undefined){
            res.render('dashboard', { user: req.session.user });
        }else{
            res.redirect('/loginForm');
        }

    },
    profile: (req, res) => {
        console.log("profile");
        if (req.session.user !== undefined){
            res.render('profile', { user: req.session.user });
        }else{
            res.redirect('/loginForm');
        }
    },
    logout: (req, res) => {        
        req.session.user = undefined
        res.redirect('/');
        console.log("sesion cerrada");
    }
}
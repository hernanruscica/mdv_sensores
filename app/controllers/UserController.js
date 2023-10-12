const UserModel = require('../models/UserModel');
const bcrypt  = require('bcryptjs');
const saltRounds = 10; // Número de rondas de sal para bcrypt


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
            estado: req.body.estado || 1,
            //fecha_creacion: req.body.fecha_creacion || '2023-10-12',
            direcciones_id: req.body.direcciones_id || 1
        };
        //console.log(userData);

        await UserModel.insert(userData)
        .then((results) => {
            // Realizar acciones de éxito aquí si es necesario          
            if (results.affectedRows > 0){
                delete userData.password;
                console.log("Inserción exitosa:", userData);
                //mail.sendWelcome(data, token);
                //return res.status(200).json({message: 'Ok', results: data});
                //res.status(200).render('home', {message: `Se registró correctamente, se envió su token al correo ${data.email}`});
            }
        })
        .catch((error) => {
            // Manejar el error y enviar una respuesta HTTP aquí
            console.error(`Error en la inserción: ${error}`);
            if (error.code == 'ER_DUP_ENTRY'){                    
                console.log('No se inserto correctamente, atributos unicos, ya insertados en la tabla.', userData);
                //res.status(409).json({message: 'Conflict', results: 'No se inserto correctamente, atributos unicos, ya insertados en la tabla.'});
                //res.status(409).render('home', {message: `Ya existe un usuario con ese nombre de usuario o correo registrado en el sitio` });                    

            }else {
                console.log('Error al insertar el registro en la tabla de la Base de datos', userData);
                //res.status(500).json({message: 'Error', results: 'Error al insertar el registro en la tabla de la Base de datos'});
                //res.status(500).render('home', {message: `Ocurrió un error al insertar el usuario en la base de datos` });                                    
            }                    
        });

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
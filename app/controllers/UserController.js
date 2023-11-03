const LocationModel = require('../models/LocationModel.js');
const UserModel = require('../models/UserModel.js');
const mail = require('../utils/mail.js');
const bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10; // Número de rondas de sal para bcrypt



module.exports = {
    getAll: async (req, res)=>
    {        
        console.log('get all users controller');


        const usersList = await UserModel.getAll();
        res.render('users',{user: req.session.user, userList: usersList})
    },
    add: async (req, res) => {
        console.log('add User controller', req.body.nombre_1);

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

        if (req.session.user !== undefined){
            req.session.user = undefined;
        }

        const userToken  = req.params.userToken;        

        try {
            const decodedToken = jwt.verify(userToken, process.env.SECRET_KEY);
            // Hacer algo con el token decodificado

            const userDni = decodedToken.dni;
            console.log(`Activate acount with dni: ${userDni} and userToken: ${userToken}`);

            
            const results = await UserModel.updateState(userDni, 1);
            
            if (results.affectedRows > 0){
                console.log('usuario encontrado por dni y en estado "activo"');
                res.render('setPasswordForm', {results: 'activacioncorrecta', 
                                    message: 'Cuenta de usuario activada correctamente, ahora tiene que definir una contrasenia',                                    
                                    userToken: userToken,
                                    userDni: userDni});
                console.log(userDni, userToken);
            }else{
                console.log('DNI del usuario NO encontrado');
                res.render('home', {results: 'activacioncorrecta', 
                                    message: 'Cuenta de usuario NO activada, se produjo un error', 
                                    user: req.session.user});                        
            }

          } catch (error) {
            // Manejar el error relacionado con el token
            if (error instanceof jwt.JsonWebTokenError) {
              console.error('Token inválido:', error.message);
              console.log(req.session.user);
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
    passwordForm: (req, res) => {
        //no la uso por ahora, porque hago un render al formu de cambio de pass
        const userDni = req.params.dni;
    },
    setPassword: async (req, res) => {
        const userToken = req.params.userToken;
        const password =  req.body.password2;
        
        //ahora verificar token, buscar por dni y actualizar el password, si todo bien,  enviar a login, sino mostrar errores
        try {
            const decodedToken =  jwt.verify(userToken, process.env.SECRET_KEY);
            const userDni = decodedToken.dni;
            console.log(`Actualizando la contrasenia del usuario con DNI ${userDni} y Password: ${password}`);

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const results = await UserModel.updatePassword(userDni, hashedPassword);
            
            if (results.affectedRows > 0){
                console.log('Usuario encontrado y password actualizado');
                res.render('loginForm', {results: 'passwordUpdated',
                                        message: 'Contraseña registrada correctamente, ahora tiene que iniciar sesión con su usuario y contraseña.'});
            }else{
                console.log('Usuario no encontrado.');
                res.render('home', {results: 'registroPasswordIncorrecto', 
                                    message: 'La contraseña NO pudo ser registrada, se produjo un error', 
                                    user: req.session.user});   
            }

        }catch(error){
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
    registerForm: async (req, res) => {
      console.log("registerUserForm");      

      const  locations = await LocationModel.getAll();

      const roles = [
        {
          id: 7,
          nombre: "operario",
          descripcion: "Operario de una ubicación",
        },
        {
          id: 8,
          nombre: "administrador",
          descripcion: "Admin de una ubicacion, controla operarios",
         }
        // {
        //   id: 9,
        //   nombre: "propietario",
        //   descripcion: "'Todos los permisos, sobre las demas tablas'",
        // }
      ];

      res.render('registerUserForm', {user: req.session.user, locations: locations, roles: roles});      
    },
    editForm: async (req, res) => {
        //prueba con 40159357
        const userDni = parseInt(req.params.dni) || 0;
        //console.clear();
        if (req.session.user == undefined){
            console.log("Usuario que hace la consulta no esta logueado en la aplicacion.");
            return res.redirect('/loginform');
        }

        
        //console.clear();
        console.log(`editForm controller buscando usuario con dni: ${userDni}`);

        const  results = await UserModel.getByDni(userDni);
        const userDataBD = results[0];
        let userExists =  (results.length > 0) ;
        console.log("viewUser controller", userDataBD);

        const  locations = await LocationModel.getAll();
        const roles = [
            {
              id: 7,
              nombre: "operario",
              descripcion: "Operario de una ubicación",
            },
            {
              id: 8,
              nombre: "administrador",
              descripcion: "Admin de una ubicacion, controla operarios",
             }            
          ];

        if (userExists === true){
            console.log("usuario encontrado para editar!", userDataBD.nombre_1, userDataBD.dni, userDataBD.password, userDataBD.calle, userDataBD.id);    
            const userId = userDataBD.id;
            const locationRoles = await UserModel.getLocationRolesById(userId);                                                
            console.log("datos de la ubicacion y roles del usuario:", locationRoles);                  
            return res.render('editUserForm', { user: req.session.user, userRequired: userDataBD, userLocationRoles: locationRoles[0], locations: locations, roles: roles});
        }else{
            console.log(`Usuario con dni: ${userDni} No encontrado para editar`);
            return res.redirect('/');
        }
           
    },
    authenticate: async (req, res) => {
        const userData = {
            dni: parseInt(req.body.dni),
            password: req.body.password
        }
        console.log(typeof userData.dni, typeof userData.password);
        const  results = await UserModel.authenticate(userData.dni);
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
                    res.render('loginForm', {results: 'loginFails',
                                            message: 'El DNI y/o la contraseña son incorrectos, comuniquese con el administrador para restablecer la contraseña.'});
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
    viewUser: async (req, res) => {
        //prueba con 40159357
        const userDni = (req.params.dni) ?  parseInt(req.params.dni) : 0;
        
        if (req.session.user === undefined){
            console.log("Usuario que hace la consulta no esta logueado en la aplicacion.", req.session.user);
            return res.redirect('/loginform');
        }

        
        
        console.log(`viewUser controller buscando usuario con dni: ${userDni}`);

        const  results = await UserModel.getByDni(userDni);
        const userDataBD = results[0];
        let userExists =  (results.length > 0) ;
        //console.log("viewUser controller", userExists, userDataBD);
        if (userExists === true){
            console.log("usuario encontrado!", userDataBD.nombre_1, userDataBD.dni, userDataBD.password, userDataBD.calle, userDataBD.id);    
            console.log(`de la sesion de ${req.session.user.nombre_1}`)
            const userId = userDataBD.id;
            const locationRoles = await UserModel.getLocationRolesById(userId);                                                
            console.log("datos de la ubicacion y roles del usuario:", locationRoles);                  
            return res.render('profile', { user: req.session.user, userRequired: userDataBD, userLocationRoles: locationRoles[0]});
        }else{
            console.log(`Usuario con dni: ${userDni} No encontrado`);
            return res.redirect('/users/all');
        }
        
    },
    logout: (req, res) => {        
        req.session.user = undefined;
        res.redirect('/');
        console.log("sesion cerrada");
    },
    deleteByDni: async (req, res) => {        
        const userDni = parseInt(req.params.dni);
        console.log(`borrando al usuario con dni : ${userDni} desde el controller`);
        //deleteByDni
         const results = await UserModel.deleteByDni(userDni);
         console.log(results);
         if (results.affectedRows > 0){
            res.status(200).json({message: 'OK', results: results});
         }else{
            res.status(500).json({message: 'ERROR', results: results});
         }
    },
    sendActivation: async (req, res) => {
        const EsUsuarioHabilitado = (typeof (req.session.user) !== 'undefined');
        if (!EsUsuarioHabilitado){
            console.log('No esta logueado o no tiene los permisos necesarios');
            res.redirect('/');
        }
        const userDni = parseInt(req.params.dni) || 0;
        console.log(`send activation to userDni : ${userDni} lo pide ${req.session.user.nombre_1} ${req.session.user.apellido_1} ${EsUsuarioHabilitado}`);
        //aca falta la logica para obtener datos del usuario de la bd y despues enviar el email.

        const results = await UserModel.getByDni(userDni);

        let usuarioEncontrado = results.length > 0;

        if (usuarioEncontrado) {
            console.log('Usuario Encontrado !', results[0]);
            const userData = results[0];
            const userToken = jwt.sign({dni: userData.dni}, process.env.SECRET_KEY, {expiresIn: 86400}); //expira en un dia
            mail.sendActivation(userData, userToken);
            return res.render('dashboard', {results: 'correoenviado', 
                                            message: `Se envio un correo de activación a la dirección: ${userData.email} `,
                                            user: req.session.user});  
        }else{
            console.log('Usuario No Encontrado !');
        }
        
        
        
        
        
    }
}
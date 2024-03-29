
const LocationModel = require('../models/LocationModel');
const DataloggerModel = require('../models/DatalogerModel');
const UserModel = require('../models/UserModel');
const AddressModel = require('../models/AddressModel');
const dataBuild = require('../utils/dataBuild');

module.exports = {
    add: async (req, res) => {
        console.log(`Agregando la ubicacion ${req.body.nombre}, descripcion: ${req.body.descripcion}`);
        let insertId = null;
        //envio datos falsos o los que luego se usaran como default, pero deberia recibir los datos del form de registro de ubicacion
        const dataDireccion = {
            calle: req.body.calle  ,
            numero: req.body.numero  ,
            localidad: req.body.localidad  ,
            partido: req.body.partido  ,
            provincia: req.body.provincia  ,
            codigo_postal: 0,
            latitud: 0,
            longitud: 0
          }
        
          //console.log(dataDireccion)
        try {
            const results = await AddressModel.add(dataDireccion);
            if (results.affectedRows > 0){
                console.log(`Datos insertados correctamente con el id: ${results.insertId}`);
                insertId = results.insertId;
                // aca tengo que insertar la ubicacion con el locationModel.add
                //falta agregar el campo email a la BD domingo 25/02/2024
                //puedo registrar una ubicacion con su direccion correctamente, pero me falta tener los permisos para verla
                const imageName = (req.file != undefined) ? req.file.filename : req.body.foto;  
                const dataUbicacion = {
                    nombre: req.body.nombre,
                    descripcion: req.body.descripcion,
                    foto: imageName,
                    telefono: req.body.telefono,
                    email: req.body.email,
                    direcciones_id: insertId
                };                

                const resultsLocationAdd = await LocationModel.add(dataUbicacion);
                console.log(resultsLocationAdd.insertId);

                const dataLocationUserRole = {
                    usuarios_id: req.session.user.id,
                    ubicaciones_id: resultsLocationAdd.insertId,
                    roles_id: 9
                }

                //console.log('dataLocationUserRole', dataLocationUserRole)

                const locationUserRoleAdded = await LocationModel.addLocationUserRole(dataLocationUserRole);
                console.log(locationUserRoleAdded);

                //deberia poder hacer un rollback aunque en el metodo de agregar una ubicacion, el usuario y la ubicacion son nuevas y el rol es propietario
                if (resultsLocationAdd.affectedRows > 0 && locationUserRoleAdded.affectedRows > 0){
                    res.render('messages', {results: 'addLocationOK', 
                                            message: `La ubicacion ${dataUbicacion.nombre} se registro correctamente`,
                                            locationId: resultsLocationAdd.insertId});
                }else{
                    res.render('messages', {results: 'addLocationFails', 
                                            message: `La ubicacion ${dataUbicacion.nombre} No se registro correctamente`})
                }

              }else
                console.log(`Datos no insertados`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error interno del servidor');
        }        

        //return res.status(200).send(`Agregando la ubicacion ${req.body.nombre}, descripcion: ${req.body.descripcion} con el insertId: ${insertId}`); 
        //const results = await AddressController.add()
    },
    getAll: async (req, res) => {
        console.log("getAll Locations for one particular user");

        //una especie de seguridad para ver si esta logueado
        if (req.session.user == undefined){
            console.log('usuario no logueado o no encontrado');
            return res.status(200).send('usuario no logueado o no encontrado');                
        }
        
        let locationsList = [];
        // if (req.session.user.espropietario === 1){
        //     console.log("Usuario propietario");
        //     locationsList = await LocationModel.getAll();     
        // }else{
            //caso que el usuario no sea propietario
        const userId = req.session.user.id;
        //consigo las ubicaciones y los roles en cada una de ellas, para un determinado usuario
        const locationRoles = await UserModel.getLocationRolesById(userId);   
        
        for (const locationRole of locationRoles){            
            const location = await LocationModel.getById(locationRole.id);            
            locationsList.push(...location);
        }
        // }
        
        res.render('locations',{user: req.session.user, locationsList: locationsList});
    },
    viewLocation: async (req, res) => {
        console.log("viewLocation Controller");
        const locationId = parseInt(req.params.id);
        let location = null;
        const allDataloggers = await DataloggerModel.getAll();  

        //Busco la informacion de la ubicacion a mostrar
        try {
            const results = await LocationModel.getById(locationId);
            //saco el id y el nombre y lo pongo en session cookie para armar el breadcrumb    
            if (results.length > 0 ){
                location= results[0];
                console.log(location);   
                req.session.location = {
                    id: results[0].id,
                    nombre: results[0].nombre
                }            
            } else{
                return res.render('messages', {results: 'locationNoFound', 
                                               message: `Ubicacion con id ${locationId} no encontrada !`})
            }      
        }catch(error){
            console.error(error);
            res.status(500).send('Error interno del servidor.<br><a href="/dashboard">panel de control</a>');
        }
        
        try {        
            const dataloggers = await dataBuild.GetDataloggersInfoByLocation(locationId);
            //console.log(dataloggers);                      
            res.render('viewLocation', { user: req.session.user, 
                                            location: location, 
                                            dataloggersInfo: dataloggers, 
                                            allDataloggers: allDataloggers});
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    }  ,
    registerForm: (req, res)   => {
        res.render('registerLocationForm', {user: req.session.user});
    },
    deleteById: async (req, res) => {        
        const id = parseInt(req.params.id);
        console.log(`borrando la ubicación con id : ${id} desde el LocationController`);
        //deleteById
         const results = await LocationModel.deleteById(id);
         console.log(results);
         if (results.affectedRows > 0){
            res.status(200).json({message: 'OK', results: results});
         }else{
            res.status(500).json({message: 'ERROR', results: results});
         }
    },
    editForm: async (req, res) => {
        console.log("Editando la ubicación con id: ", req.params.id);
        const locationId = req.params.id;        
        const results = await LocationModel.getById(locationId);

        if (results.length > 0){           
            const allDataloggers = await DataloggerModel.getAll();  
            const dataloggers = await dataBuild.GetDataloggersInfoByLocation(locationId); 
            return res.render('editLocationForm', {user: req.session.user, 
                                                    location: results[0], 
                                                    allDataloggers: allDataloggers,
                                                    dataloggersInfo: dataloggers});
        }else{
            console.log('Ubicación no encontrada!');
            return res.render('messages', {results: 'locationNoFound', 
                                           message: `La ubicación con id ${locationId} no se encuentra en la Base de datos !`});
        }
        
    },
    update: async (req, res) => {

        const imageName = (req.file != undefined) ? req.file.filename : req.body.foto;                          
        
        const dataUbicacion = {
            id: req.body.id,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            foto: imageName,
            telefono: req.body.telefono,
            email: req.body.email,
            direcciones_id: req.body.direcciones_id,
            calle: req.body.calle,
            numero: parseInt(req.body.numero),  
            provincia: req.body.provincia,
            partido: req.body.partido,
            localidad: req.body.localidad 
        };  
        console.log(`Actualizando la ubicacion con id: ${dataUbicacion.id}`, dataUbicacion);
        const updateOk = await LocationModel.updateLocation(dataUbicacion);
        
        if (updateOk !== null && updateOk == true){
            return res.render('messages', {results : 'editLocationOk', 
                                            message: `La ubicacion ${dataUbicacion.nombre} fue editada correctamente!`,
                                            locationId: dataUbicacion.id})
        }else{
            return res.render('messages',{ results : 'editLocationFails', 
                                            message: `Error al querer editar la ubicacion  ${dataUbicacion.nombre}!`,
                                            locationId: dataUbicacion.id})
        }
    },
    addLocationUserRole: async (req, res) => {
        const dataLocationUserRole = {
            usuarios_id: req.body.usuarios_id,
            usuarios_dni: req.body.usuarios_dni_nuevo,
            roles_id: req.body.roles_id,            
            ubicaciones_id: req.body.ubicaciones_id
        }
        console.log(`agregando un nuevo rol en una ubicacion para el usuario con id ${dataLocationUserRole.usuarios_id}`, dataLocationUserRole);

        const locationUserRoleAdded = await LocationModel.addLocationUserRole(dataLocationUserRole);        
        console.log(locationUserRoleAdded);

        //deberia poder hacer un rollback aunque en el metodo de agregar una ubicacion, el usuario y la ubicacion son nuevas y el rol es propietario
        if (locationUserRoleAdded.affectedRows > 0){
            res.render('messages', {results: 'addLocationUserRoleOk', 
                                    message: `El rol  se registro correctamente`,                                          
                                    userDni: dataLocationUserRole.usuarios_dni});
        }else{
            res.render('messages', {results: 'addLocationUserRoleFails', 
                                    message: `Fallo en el registro del rol`,
                                    userDni: dataLocationUserRole.usuarios_dni});
        }             
    },
    updateLocationUserRole: async (req, res) => {
        const dataLocationUserRole = {
            id: req.body.usuarios_x_ubicaciones_x_roles_id_edit,
            dni: req.body.usuarios_dni_edit,
            usuarios_id: req.body.usuarios_id_edit,
            roles_id: req.body.roles_id_edit,            
            ubicaciones_id: req.body.ubicaciones_id_edit
        }
        console.log(`editando un rol en una ubicacion para el usuario con id ${dataLocationUserRole.usuarios_id}`, dataLocationUserRole);

        const locationUserRoleAdded = await LocationModel.updateLocationUserRole(dataLocationUserRole);        
        console.log(locationUserRoleAdded);

        //deberia poder hacer un rollback aunque en el metodo de agregar una ubicacion, el usuario y la ubicacion son nuevas y el rol es propietario
        if (locationUserRoleAdded.affectedRows > 0){
            res.render('messages', {results: 'editUserOk', 
                                    message: `El rol se edito correctamente`, 
                                    userDni: dataLocationUserRole.dni});
        }else{
            res.render('messages', {results: 'editUserFails', 
                                    message: `Fallo en la edicion del rol`, 
                                    userDni: dataLocationUserRole.dni});
        }             
    },
    addDataloggerLocation: async (req, res) => {
        const dataDataloggerLocation = {
            usuario_id: req.body.usuario_id,                     
            ubicacion_id: req.body.ubicacion_id,
            datalogger_id: req.body.datalogger_id
        }
        //res.send(`agregando un nuevo datalogger en una ubicacion ${dataDataloggerLocation.usuario_id} ${dataDataloggerLocation.ubicacion_id} dataloggerid: ${dataDataloggerLocation.datalogger_id}`);

         const dataloggerLocationAdded = await LocationModel.addDataloggerLocation(dataDataloggerLocation);        
         //console.log(dataloggerLocationAdded);

        //deberia poder hacer un rollback aunque en el metodo de agregar una ubicacion, el usuario y la ubicacion son nuevas y el rol es propietario
        if (dataloggerLocationAdded.affectedRows > 0){
            return res.render('messages', {results: 'addLocationOK', 
                                           message: `El datalogger se asocio correctamente`,
                                           locationId: dataDataloggerLocation.ubicacion_id});
        }else{
            return res.render('messages', {results: 'addLocationFails', 
                                           message: `Fallo en la asociacion del datalogger`,
                                           locationId: dataDataloggerLocation.ubicacion_id})
        }             
    },
    deleteDataloggerById: async (req, res) => {        
        const id = parseInt(req.params.id);
        console.log(`Eliminando la asociacion datalogger en ubicacion con id> ${id} `);
        const dataloggerLocation = await LocationModel.deleteDataloggerLocation(id); 
        if (dataloggerLocation.affectedRows > 0){
            res.status(200).json({message: 'OK', results: dataloggerLocation});
         }else{
            res.status(500).json({message: 'ERROR', results: dataloggerLocation});
         }
        
    }
}
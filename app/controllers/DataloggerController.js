
const LocationModel = require('../models/LocationModel');
const DataloggerModel = require('../models/DatalogerModel');
const DataModel = require('../models/DataModel');
const UserModel = require('../models/UserModel');

module.exports = {
    getAll: async (req, res) => {
        try {
            //const userId = req.params.userid;
            let  allDataloggers = [];

            if (req.session.user == undefined){
                console.log('usuario no logueado o no encontrado');
                return res.status(200).send('usuario no logueado o no encontrado');                
            }

             if (req.session.user.espropietario === 1){
                 console.log("Usuario propietario");
                 allDataloggers = await DataloggerModel.getAll();                
             }else{
                //caso que el usuario no sea propietario
                const userId = req.session.user.id;            
                const locationsRolesList = await UserModel.getLocationRolesById(userId);    
                console.log(locationsRolesList)
                // Iterar sobre cada ubicación y obtener los dataloggers asociados
                for (const locationRole of locationsRolesList) {
                    const locationId = locationRole.id;
                    console.log(`Buscando dataloggers para la ubicación con ID ${locationId}`);
                    
                    // Obtener los dataloggers para la ubicación actual
                    const dataloggers = await DataloggerModel.getByLocationId(locationId);

                    // Agregar el atributo 'nombre' de locationRole a cada datalogger
                    dataloggers.forEach(datalogger => {
                        datalogger.ubicacion_nombre = locationRole.nombre;
                    });
                    
                    // Agregar los dataloggers al array general
                    allDataloggers.push(...dataloggers);                
                }
            }

            return res.render('dataloggers',{user: req.session.user, dataloggersList: allDataloggers})    
            
        } catch (error) {
            console.error('Error al obtener los dataloggers:', error);
            return res.status(500).json({ error: 'Ocurrió un error al obtener los dataloggers.' });
        }
    },
    
    
    viewDatalogger: async (req, res) => {
        const id = req.params.id;                      
        
        //  traer la info de la tabla dataloggers y la data de los canales activos de hace una hora. buscando con la id del datalogger
        const results = await DataloggerModel.getById(id);        
        const dataloggerData =  (results.length > 0) ? results[0] : [];        
        const results02 = await DataloggerModel.getChannelsById(id);
        const activeChannels = (results02.length > 0) ? results02 : [];
       
        req.session.datalogger = {
            id: results.id,
            nombre: results.nombre
        }

        const dataDigital = await DataModel.getDigital('guemes', 'd2', '1 HOUR');
        const dataAnalog = await DataModel.getAnalog('guemes', 'a1', '1 DAY');
        console.log( dataDigital.length);
        console.log(dataAnalog.length);

        res.render('viewDatalogger', {user: req.session.user, 
            location: req.session.location, 
            datalogger: dataloggerData, 
            channels: activeChannels});

        
    },
    viewChannel: async (req, res) => {
        const id = req.params.id;
        const idChannel = req.params.idchannel;        
        console.log(`Viendo el canal ${idChannel} del datalogger con id: ${id}`);        
        
        const results = await DataloggerModel.getById(id);      
        let currentData = null;
        
        req.session.datalogger = {
            id: results[0].id,
            nombre: results[0].nombre,
            nombre_tabla: results[0].nombre_tabla
        }
        const results02 = await DataloggerModel.getChannellbyId(idChannel);        
        const currentChannel = results02[0];

        //Si es analogico
        if (currentChannel.nombre_columna.startsWith('a')){            
            currentChannel.isAnalog = true;
            //currentData = await DataModel.getDataByChannelOneDay(req.session.datalogger.nombre_tabla, currentChannel.nombre_columna);
            currentData = await DataModel.getAnalog(req.session.datalogger.nombre_tabla, currentChannel.nombre_columna, '1 DAY');

        //si es Digital 
        }else{            
            currentChannel.isAnalog = false;     
            currentData = await DataModel.getDataByChannelDigitalOneDay(req.session.datalogger.nombre_tabla, currentChannel.nombre_columna);       
        }        

        console.log(currentChannel, currentData[0]);            

        res.render('viewChannel', {user: req.session.user, 
                                   location: req.session.location, 
                                   datalogger: req.session.datalogger,
                                   id: id, currentChannel: currentChannel, dataChannel: currentData || []});
        
    },
    deleteById: async (req, res) => {
        const id = parseInt(req.params.id);
        console.log(`Eliminando el datalogger con id ${id}`);
        const results = await DataloggerModel.deleteById(id);
         console.log(results);
         if (results.affectedRows > 0){
            res.status(200).json({message: 'OK', results: results});
         }else{
            res.status(500).json({message: 'ERROR', results: results});
         }
    },
    registerForm: async (req, res) => {
        console.log("Mostrando el formulario de registro de un nuevo datalogger.");
        res.render('registerDataloggerForm', {user: req.session.user});
    },
    add: async (req, res) => {
        const imageName = (req.file != undefined) ? req.file.filename : req.body.foto;
        const dataloggerData = {
            nombre: req.body.nombre,
            direccion_mac: req.body.direccion_mac,
            descripcion: req.body.descripcion,
            nombre_tabla: req.body.nombre_tabla,
            foto: imageName
        }
        console.log(`insertando un nuevo datalogger a la BD con nombre: ${dataloggerData.nombre}`);

        results = await DataloggerModel.add(dataloggerData);
        if (results.affectedRows > 0){
            console.log("Datalogger insertado correctamente");
            res.render('messages', {results: 'addDataloggerOk', 
                                    message: `El datalogger ${dataloggerData.nombre} se registro correctamente`,
                                    dataloggerId: results.insertId});
        }else{
            console.log("Error al insertar el datalogger");
            res.render('messages', {results: 'addDataloggerFails', 
                                    message: `Error al registrar el datalogger ${dataloggerData.nombre} !`});
        }
    },
    editForm: async (req, res) => {
        const dataloggerId = req.params.id;
        console.log(`Viendo el formulario de edicion de datalogger con id ${dataloggerId}`);
        const dataloggerBd = await DataloggerModel.getById(dataloggerId);
        console.log(dataloggerBd)
        res.render('editDataloggerForm', {user: req.session.user, datalogger: dataloggerBd[0]});
    },
    update: async (req, res) => {

        const imageName = (req.file != undefined) ? req.file.filename : req.body.foto;                          
        
        const dataDatalogger = {
            id: req.body.id,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            nombre_tabla: req.body.nombre_tabla,
            foto: imageName,                      
            direccion_mac: req.body.direccion_mac 
        };  
        console.log(`Actualizando el datalogger con id: ${dataDatalogger.id}`, dataDatalogger);
        const updateOk = await DataloggerModel.update(dataDatalogger);
        
        if (updateOk !== null && updateOk == true){
            return res.render('messages', {results : 'editDataloggerOk', 
                                            message: `El datalogger ${dataDatalogger.nombre} fue editado correctamente!`,
                                            dataloggerId: dataDatalogger.id})
        }else{
            return res.render('messages', {results : 'editDataloggerFails', 
                                            message: `Error al querer editar el datalogger  ${dataDatalogger.nombre}!`,
                                            dataloggerId: dataDatalogger.id})
        }
    }
}
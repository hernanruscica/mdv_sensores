
const LocationModel = require('../models/LocationModel');
const DataloggerModel = require('../models/DatalogerModel');
const DataModel = require('../models/DataModel');
const UserModel = require('../models/UserModel');
const dataBuild = require('../utils/dataBuild');

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
        console.log(`Viendo el datalogger con id: ${id}`);               
                
        const results = await DataloggerModel.getById(id);        
        const dataloggerData =  (results.length > 0) ? results[0] : [];       
        const { ubicacion_id }  = dataloggerData;

        const results02 = await DataloggerModel.getChannelsById(id);
        const activeChannels = (results02.length > 0) ? results02 : [];

        const results03 = await LocationModel.getById(ubicacion_id);
        const locationData = (results03.length > 0) ? results03[0] : [];
        
        const data = await dataBuild.getAllDataChannels('guemes', activeChannels, '1 DAY');       
        
        console.log(activeChannels);

        res.render('viewDatalogger', {user: req.session.user, 
            location: locationData, 
            datalogger: dataloggerData, 
            channels: activeChannels,
            channelsData: data});        
    },
    viewChannel: async (req, res) => {
        const { id, idchannel }  = req.params;
        console.log(`Viendo el canal ${idchannel} del datalogger con id: ${id}`);        
        
        const results = await DataloggerModel.getById(id);  
        const dataloggerData =  (results.length > 0) ? results[0] : [];   

        const results02 = await DataloggerModel.getChannellbyId(idchannel);        
        const currentChannel = (results.length > 0) ? results02[0] : [];

        const results03 = await LocationModel.getById(dataloggerData.ubicacion_id);
        const location = (results03.length > 0) ? results03[0] : [];

        let currentData = null;   

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
        //console.log(currentChannel, currentData[0]); 
        res.render('viewChannel', {user: req.session.user, 
                                   location: location, 
                                   datalogger: dataloggerData,
                                   id: id, 
                                   currentChannel: currentChannel, 
                                   dataChannel: currentData || []});
        
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
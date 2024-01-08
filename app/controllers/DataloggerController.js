
const LocationModel = require('../models/LocationModel');
const DataloggerModel = require('../models/DatalogerModel');
const DataModel = require('../models/DataModel');

module.exports = {
    getAll: async (req, res) => {
        console.log("getAll Locations");
        const locationsList = await LocationModel.getAll();        
        res.render('locations',{user: req.session.user, locationsList: locationsList});
    },
    viewDatalogger: async (req, res) => {
        const id = req.params.id;                      
        //console.log(`viewDatalogger Controller con id ${id}`);     

        //  traer la info de la tabla dataloggers y la data de los canales activos de hace una hora. buscando con la id del datalogger
        const results = await DataloggerModel.getById(id);         
        const results02 = await DataloggerModel.getChannelsById(id);
        //console.log(results[0]);
        req.session.datalogger = {
            id: results.id,
            nombre: results.nombre
        }
        res.render('viewDatalogger', {user: req.session.user, location: req.session.location, datalogger: results[0] || [], channels: results02 || []});

        // Cambia a este formato 2023-08-23 12:50:02
        //const fechaFormateadaParaApex = dataloggerData[0].fecha.toISOString().slice(0, 19).replace('T', ' ');   
        //console.log(fechaFormateadaParaApex);    
    },
    viewChannel: async (req, res) => {
        const id = req.params.id;
        const idChannel = req.params.idchannel;        
        console.log(`Viendo el canal ${idChannel} del datalogger con id: ${id}`);

        
        const results = await DataloggerModel.getById(id);      
        console.log(results[0]);
        req.session.datalogger = {
            id: results[0].id,
            nombre: results[0].nombre
        }

        //aca tengo que hacer la busqueda en la BD de los datos del canal y los datos de las ultimas 24 hs. o tiempo necesario para atras.

        // El Modelo puede traer la data de un periodo de tiempo determinado, de un determinado datalogger y de un determinado canal 
        //const currentData = await DataModel.getDataByChannel('guemes', 'a1', '2023-12-28', '2023-12-29');        
        const currentData = await DataModel.getDataByChannelOneDay('guemes', 'a1');
        //console.log(currentData);        

        res.render('viewChannel', {user: req.session.user, 
                                   location: req.session.location, 
                                   datalogger: req.session.datalogger,
                                   id: id, idChannel: idChannel, dataChannel: currentData || []});
        
    }
}
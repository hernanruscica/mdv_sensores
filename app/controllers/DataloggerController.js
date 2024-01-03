
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
        const id = parseInt(req.params.id);              
        console.log(`viewDatalogger Controller con id ${id}`);     


        // El Modelo puede traer la data de hace una hora para mostrar los indicadores resumidos de cada canal activo

        
        res.render('viewDatalogger', {user: req.session.user, id: id});

        // Cambia a este formato 2023-08-23 12:50:02
        //const fechaFormateadaParaApex = dataloggerData[0].fecha.toISOString().slice(0, 19).replace('T', ' ');   
        //console.log(fechaFormateadaParaApex);    
    },
    viewChannel: async (req, res) => {
        const id = req.params.id;
        const idChannel = req.params.idchannel;        
        console.log(`Viendo el canal ${idChannel} del datalogger con id: ${id}`);

        //aca tengo que hacer la busqueda en la BD de los datos del canal y los datos de las ultimas 24 hs. o tiempo necesario para atras.

        // El Modelo puede traer la data de un periodo de tiempo determinado, de un determinado datalogger y de un determinado canal 
        //const currentData = await DataModel.getDataByChannel('guemes', 'a1', '2023-12-28', '2023-12-29');        
        const currentData = await DataModel.getDataByChannelOneDay('guemes', 'a1');
        //console.log(currentData);        

        res.render('viewChannel', {user: req.session.user, id: id, idChannel: idChannel, dataChannel: currentData || []});
        
    }
}
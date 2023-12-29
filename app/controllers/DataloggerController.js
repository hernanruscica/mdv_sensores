
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
        const now =  '2023-12-29 13:27:00' 
        console.log(`viewDatalogger Controller con id ${id}`);     

        //para la pagina viewDatalogger, obtengo datos de hace una hora para mostrar los indicadores resumidos de cada canal,
        

        // El Modelo puede traer la data de un periodo de tiempo determinado, de un determinado datalogger y de un determinado canal 
        const currentData = await DataModel.getData('guemes', 'a1', '2023-12-29 12:27:00', '2023-12-29 13:27:00');
        const currentData02= await DataModel.getData('guemes', 'a2', '2023-12-29 12:27:00', '2023-12-29 13:27:00');

        console.log(currentData, currentData02);        
        res.render('viewDatalogger', {user: req.session.user, dataChannel: currentData || [], dataChannel02: currentData02 || []});

        // Cambia a este formato 2023-08-23 12:50:02
        //const fechaFormateadaParaApex = dataloggerData[0].fecha.toISOString().slice(0, 19).replace('T', ' ');   
        //console.log(fechaFormateadaParaApex);    
    },
    viewChannel: async (req, res) => {
        const id = req.params.id;
        const idChannel = req.params.idchannel;        
        console.log(`Viendo el canal ${idChannel} del datalogger con id: ${id}`);

        //aca tengo que hacer la busqueda en la BD de los datos del canal y los datos de las ultimas 24 hs. o tiempo necesario para atras.

        

        res.render('viewChannel', {user: req.session.user, id: id, idChannel: idChannel});
    }
}
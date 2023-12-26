
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

        //para la pagina viewDatalogger, obtengo datos de hace una hora para mostrar los indicadores resumidos de cada canal,
        //pero esta misma funcion puedo usarla para mostrar mas datos en los detalles de cada canal.
        //2023-08-23T21:20:01.000Z    2023-08-23T21:25:01.000Z  
        const dataloggerData = await DataModel.getData('guemes', '2023-08-23 09:50:02', '2023-08-23 11:50:01');  
        
        // Cambia a este formato 2023-08-23 12:50:02
        const fechaFormateadaParaApex = dataloggerData[0].fecha.toISOString().slice(0, 19).replace('T', ' ');   
        console.log(fechaFormateadaParaApex);
        
        res.render('viewDatalogger', {user: req.session.user});
    },
    viewChannel: async (req, res) => {
        const id = req.params.id;
        const idChannel = req.params.idchannel;        
        console.log(`Viendo el canal ${idChannel} del datalogger con id: ${id}`);

        //aca tengo que hacer la busqueda en la BD de los datos del canal y los datos de las ultimas 24 hs. o tiempo necesario para atras.

        const currentData = await DataModel.getData('guemes', '2023-12-01', '2023-12-26');
        console.log(currentData[1]);

        res.render('viewChannel', {user: req.session.user, id: id, idChannel: idChannel, currentData: currentData});
    }
}
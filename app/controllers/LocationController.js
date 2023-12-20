
const LocationModel = require('../models/LocationModel');
const DataloggerModel = require('../models/DatalogerModel');

module.exports = {
    getAll: async (req, res) => {
        console.log("getAll Locations");
        const locationsList = await LocationModel.getAll();        
        res.render('locations',{user: req.session.user, locationsList: locationsList});
    },
    viewLocation: async (req, res) => {
        console.log("viewLocation Controller");
        try {
            const id = parseInt(req.params.id);
            const results = await LocationModel.getById(id);
            //const currentLocation = results[0];
            //console.log(location);            
            const results02 = await LocationModel.getDataloggersByLocationId(id);
            //[ { datalogger_id: 1 }, { datalogger_id: 2 } ]
            const dataloggersIds = results02.map(result => result.datalogger_id) ;
            console.log(dataloggersIds, dataloggersIds.length);
            const dataloggers = [];

            if (dataloggersIds.length > 0 ){
                dataloggersIds.forEach(async dataloggerId => {
                    const results03 = await DataloggerModel.getById(dataloggerId);
                    console.log(results03)
                    dataloggers.push(results03 );
                }); 
                console.log(dataloggers);
            }
            
            
            res.render('viewLocation', { user: req.session.user, location: results });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    }    
}
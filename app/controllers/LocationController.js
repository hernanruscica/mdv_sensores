
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
            
            const dataloggersIds = results02.map(result => result.datalogger_id) ;
            //console.log(dataloggersIds, dataloggersIds.length);     

            const GetDataloggersInfo = async (ids) => {
                if (ids.length === 0) return null;
            
                const dataloggersPromises = ids.map(async (id) => {
                    const results03 = await DataloggerModel.getById(id);
                    return results03[0];
                });
            
                const dataloggers = await Promise.all(dataloggersPromises);
                return dataloggers;
            };
            
            const dataloggers = await GetDataloggersInfo(dataloggersIds);
            //console.log(dataloggers);
            
            
            res.render('viewLocation', { user: req.session.user, location: results, dataloggersInfo: dataloggers});
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    }    
}
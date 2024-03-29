
const LocationModel = require('../models/LocationModel');
const DataloggerModel = require('../models/DatalogerModel');

module.exports = {    
    //Busco los dataloggers asociados a una ubicacion.
    GetDataloggersInfoByLocation : async (locationId) => {
        const results02 = await LocationModel.getDataloggersByLocationId(locationId);            
        const dataloggersInfo = results02.map(result => {
            return {
                datalogger_id: result.datalogger_id,
                id: result.id 
            };
        }); 
        if (dataloggersInfo.length === 0) return null;
        
        const dataloggersPromises = dataloggersInfo.map(async (dataloggerInfo) => {
            const results03 = await DataloggerModel.getById(dataloggerInfo.datalogger_id);                    
            const info = { ...results03[0], idDataloggerUbicacion: dataloggerInfo.id }; // Añadir la propiedad "id"
            return info;
        });            
        const dataloggers = await Promise.all(dataloggersPromises);
        return dataloggers;
    }
}
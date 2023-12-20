
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

        const dataloggerData = await DataModel.getData('guemes', '2023-08-01', '2023-09-04');
        console.log(dataloggerData);
        
        res.render('viewDatalogger', {user: req.session.user});
    }    
}
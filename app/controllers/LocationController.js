
const LocationModel = require('../models/LocationModel');

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
            res.render('viewLocation', { user: req.session.user, location: results });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    }    
}
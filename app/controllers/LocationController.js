
const LocationModel = require('../models/LocationModel');
const DataloggerModel = require('../models/DatalogerModel');
const UserModel = require('../models/UserModel');

module.exports = {
    getAll: async (req, res) => {
        console.log("getAll Locations");

        if (req.session.user == undefined){
            console.log('usuario no logueado o no encontrado');
            return res.status(200).send('usuario no logueado o no encontrado');                
        }
        const userId = req.session.user.id;
        const locationRoles = await UserModel.getLocationRolesById(userId);   
        const locationsList = [];
        console.log("datos de la ubicacion y roles del usuario:", locationRoles);     
        
        for (const locationRole of locationRoles){            
            const location = await LocationModel.getById(locationRole.id);            
            locationsList.push(...location);
        }
        console.log(locationsList);
        
        //const locationsList = await LocationModel.getAll();        
        
        res.render('locations',{user: req.session.user, locationsList: locationsList});
    },
    viewLocation: async (req, res) => {
        console.log("viewLocation Controller");
        try {
            const id = parseInt(req.params.id);
            const results = await LocationModel.getById(id);

            //saco el id y el nombre y lo pongo en session cookie para armar el breadcrumb
            //console.log(results[0]);            
            req.session.location = {
                id: results[0].id,
                nombre: results[0].nombre
            }

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
    }  ,
    registerForm: (req, res)   => {
        res.render('registerLocationForm', {user: req.session.user});
    }
}
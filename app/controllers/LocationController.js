
const LocationModel = require('../models/LocationModel');
const DataloggerModel = require('../models/DatalogerModel');
const UserModel = require('../models/UserModel');
const AddressModel = require('../models/AddressModel');

module.exports = {
    add: async (req, res) => {
        console.log(`Agregando la ubicacion ${req.body.nombre}, descripcion: ${req.body.descripcion}`);
        let insertId = null;
        //envio datos falsos o los que luego se usaran como default, pero deberia recibir los datos del form de registro de ubicacion
        const dataDireccion = {
            calle: req.body.calle  ,
            numero: req.body.numero  ,
            localidad: req.body.localidad  ,
            partido: req.body.partido  ,
            provincia: req.body.provincia  ,
            codigo_postal: 0,
            latitud: 0,
            longitud: 0
          }
        
          //console.log(dataDireccion)
        try {
            const results = await AddressModel.add(dataDireccion);
            if (results.affectedRows > 0){
                console.log(`Datos insertados correctamente con el id: ${results.insertId}`);
                insertId = results.insertId;
                // aca tengo que insertar la ubicacion con el locationModel.add
                //falta agregar el campo email a la BD domingo 25/02/2024
                //puedo registrar una ubicacion con su direccion correctamente, pero me falta tener los permisos para verla
                const dataUbicacion = {
                    nombre: req.body.nombre,
                    descripcion: req.body.descripcion,
                    foto: req.body.foto,
                    telefono: req.body.telefono,
                    direcciones_id: insertId
                }

                const resultsLocationAdd = await LocationModel.add(dataUbicacion);
                console.log(resultsLocationAdd.affectedRows);

                if (resultsLocationAdd.affectedRows > 0){
                    res.render('dashboard', {results: 'registrocorrecto', message: `La ubicacion ${dataUbicacion.nombre} se registro correctamente`, user: req.session.user});
                }else{
                    res.render('dashboard', {results: 'registrofallido', message: `La ubicacion ${dataUbicacion.nombre} No se registro correctamente`, user: req.session.user})
                }

              }else
                console.log(`Datos no insertados`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error interno del servidor');
        }        

        //return res.status(200).send(`Agregando la ubicacion ${req.body.nombre}, descripcion: ${req.body.descripcion} con el insertId: ${insertId}`); 
        //const results = await AddressController.add()
    },
    getAll: async (req, res) => {
        console.log("getAll Locations for one particular user");

        if (req.session.user == undefined){
            console.log('usuario no logueado o no encontrado');
            return res.status(200).send('usuario no logueado o no encontrado');                
        }
        const userId = req.session.user.id;
        //consigo las ubicaciones y los roles en cada una de ellas, para un determinado usuario
        const locationRoles = await UserModel.getLocationRolesById(userId);   
        const locationsList = [];
        //console.log("datos de la ubicacion y roles del usuario:", locationRoles);     
        
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
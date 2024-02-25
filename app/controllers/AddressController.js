const AddressModel = require('../models/AddressModel')

module.exports = {
    add: async (req, res) => {

        //envio datos falsos o los que luego se usaran como default, pero deberia recibir los datos del form de registro de ubicacion
        const dataDireccion = {
            calle: req.calle  ,
            numero: req.numero  ,
            localidad: req.localidad  ,
            partido: req.partido  ,
            provincia: req.provincia  ,
            codigo_postal: 0,
            latitud: 0,
            longitud: 0
          }
        try {
            const results = await AddressModel.add(dataDireccion);
            if (results.affectedRows > 0){
                console.log(`Datos insertados correctamente con el id: ${results.insertId}`);
                return results.insertId;
              }else
                console.log(`Datos no insertados`);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error interno del servidor');
        }
    }
}
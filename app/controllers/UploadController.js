const axios = require('axios');
const fs = require('fs');
const request = require('request');


// Controlador para manejar la carga de imágenes y datos adicionales
exports.UploadImage = async (req, res) => {

  // Accede a los datos adicionales en req.body
  // const nombre = req.body.nombre;
  // const edad = req.body.edad;

  if (req.file == undefined) return; 

  // Accede a la información del archivo cargado
  const imagePath = req.file.path;
  const file = fs.createReadStream(`${imagePath}`); // ruta del archivo de imagen       

    const options = {
    method: 'POST',
    url: 'https://ruscica-code.ar/uploads.php', // URL del servidor y archivo PHP
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    formData: {
        file: file
    }
    };
    request(options, (err, res, body) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Imagen enviada correctamente a ruscica-code.ar');
      });  
};

const axios = require('axios');


// Controlador para manejar la carga de imágenes y datos adicionales
exports.UploadImage = async (req, res) => {

  // Accede a los datos adicionales en req.body
  const nombre = req.body.nombre;
  const edad = req.body.edad;

  // Accede a la información del archivo cargado
  const imagePath = req.file.path;
  //console.log(nombre, edad, imagePath);

  const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('edad', edad);
    formData.append('image', imagePath);


  try {
    // Envía la imagen y datos adicionales al otro servidor utilizando axios
    const response = await axios.post('https://ruscica-code.ar/mdvUploads.php', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },      
    });
    console.log(response.data);
    res.send('Imagen y datos cargados y enviados exitosamente.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al enviar la imagen y datos al otro servidor.');
  }
  
};

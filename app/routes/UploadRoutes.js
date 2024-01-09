const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/UploadController');

// Configuración de Multer para gestionar la carga de imágenes y datos adicionales - INCIO

const multer = require('multer');
const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, 'public/images/');
},
filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
},
});
const upload = multer({ storage: storage });
// Configuración de Multer para gestionar la carga de imágenes y datos adicionales - FIN

// Ruta principal
router.get('/', (req, res) => {
    res.render('uploadImageForm');
  });
  
  // Ruta para manejar la carga de imágenes y datos adicionales
  router.post('/', upload.single('image'), UploadController.UploadImage);
  
  module.exports = router;

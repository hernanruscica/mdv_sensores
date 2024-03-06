const express = require('express');
const LocationController = require('../controllers/LocationController.js');

const multer = require('multer');
const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, 'public/images/');
},
filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.slice(-4)}`);
},
});
const upload = multer({ storage: storage });

var router = express.Router();

router.get('/all', LocationController.getAll);
router.get('/register',  LocationController.registerForm );
router.post('/add', upload.single("image"), LocationController.add);
router.get('/editform/:id',  LocationController.editForm );
router.post('/update', upload.single("image"),   LocationController.update);
router.delete('/delete/:id', LocationController.deleteById);
router.get('/view/:id', LocationController.viewLocation);
router.post('/role/add', LocationController.addLocationUserRole);
//locations/role/update
router.post('/role/update', LocationController.updateLocationUserRole);




module.exports = router;
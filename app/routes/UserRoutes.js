const express = require('express');
const UserController = require('../controllers/UserController.js');

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


var router = express.Router();

// podria ser util para update, upload.fields([{name: 'image', maxCount: 1}, {name: 'nombre_1'}, {name: 'nombre_2'}, {name: 'apellido_1'}, {name: 'apellido_2'}, {name: 'dni'}, {name: 'email'}, {name: 'telefono'}])
router.post('/update', UserController.update);
router.get('/register',  UserController.registerForm );
router.get('/editform/:dni',  UserController.editForm );
router.post('/add', UserController.add);
router.get('/activate/:userToken', UserController.activate);
router.post('/setPassword/:userToken', UserController.setPassword);
router.post('/authenticate', UserController.authenticate);
router.get('/dashboard', UserController.dashboard);
router.get('/profile', UserController.profile);
router.get('/logout', UserController.logout);
router.get('/all', UserController.getAll);
router.delete('/:dni', UserController.deleteByDni);
router.get('/view/:dni', UserController.viewUser);
router.get('/sendactivation/:dni', UserController.sendActivation);


module.exports = router;
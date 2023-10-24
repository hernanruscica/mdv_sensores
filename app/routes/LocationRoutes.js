const express = require('express');
const LocationController = require('../controllers/LocationController.js');

var router = express.Router();

router.get('/all', LocationController.getAll);
// router.get('/registerform',  UserController.registerForm );
// router.post('/add', UserController.add);
// router.get('/profile', UserController.profile);
// router.delete('/:dni', UserController.deleteByDni);
// router.get('/view/:dni', UserController.viewUser);




module.exports = router;
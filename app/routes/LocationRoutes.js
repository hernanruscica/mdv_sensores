const express = require('express');
const LocationController = require('../controllers/LocationController.js');

var router = express.Router();


router.get('/registerform',  UserController.registerForm );
router.post('/add', UserController.add);
router.get('/profile', UserController.profile);
router.get('/all', UserController.getAll);


router.get('/activate/:userToken', UserController.activate);
router.post('/setPassword/:userToken', UserController.setPassword);
router.post('/authenticate', UserController.authenticate);
router.get('/dashboard', UserController.dashboard);

router.get('/logout', UserController.logout);

router.delete('/:dni', UserController.deleteByDni);
router.get('/view/:dni', UserController.viewUser);
router.get('/sendactivation/:dni', UserController.sendActivation);

module.exports = router;
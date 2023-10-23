const express = require('express');
const UserController = require('../controllers/UserController.js');

var router = express.Router();


router.get('/registerform',  UserController.registerForm );
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
const express = require('express');
const UserController = require('../controllers/UserController.js');

var router = express.Router();

router.get('/registerform',  UserController.registerForm );
router.post('/add', UserController.add);
router.get('/activate/:userToken', UserController.activate);
router.post('/authenticate', UserController.authenticate);
router.get('/dashboard', UserController.dashboard)
router.get('/profile', UserController.profile)
router.get('/logout', UserController.logout)

module.exports = router;
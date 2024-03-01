const express = require('express');
const LocationController = require('../controllers/LocationController.js');

var router = express.Router();

router.get('/all', LocationController.getAll);
router.get('/register',  LocationController.registerForm );
router.post('/add', LocationController.add);
// router.get('/profile', UserController.profile);
router.delete('/delete/:id', LocationController.deleteById);
router.get('/view/:id', LocationController.viewLocation);




module.exports = router;
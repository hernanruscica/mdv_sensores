const express = require('express');

const IndexController = require('../controllers/IndexController.js');


var router = express.Router();


router.get('/', IndexController.home);
router.get('/loginform',  IndexController.loginForm );


module.exports =  router;

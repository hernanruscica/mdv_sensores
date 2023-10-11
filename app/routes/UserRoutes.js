const express = require('express');
const UserController = require('../controllers/UserController.js');

var router = express.Router();

router.post('/add', UserController.add);
router.post('/authenticate', UserController.authenticate);
router.get('/dashboard', UserController.dashboard)
router.get('/logout', UserController.logout)

module.exports = router;
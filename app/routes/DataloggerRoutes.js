const express = require('express');
const DataloggerController = require('../controllers/DataloggerController.js');

var router = express.Router();

router.get('/all/', DataloggerController.getAll);
// router.get('/registerform',  UserController.registerForm );
// router.post('/add', UserController.add);
// router.get('/profile', UserController.profile);
// router.delete('/:dni', UserController.deleteByDni);
router.get('/view/:id', DataloggerController.viewDatalogger);
router.get('/view/:id/channels/:idchannel', DataloggerController.viewChannel);



module.exports = router;
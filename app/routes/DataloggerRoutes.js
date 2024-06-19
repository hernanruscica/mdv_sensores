const express = require('express');
const DataloggerController = require('../controllers/DataloggerController.js');

const multer = require('multer');
const LocationController = require('../controllers/LocationController.js');
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

router.get('/all/', DataloggerController.getAll);
router.get('/registerform',  DataloggerController.registerForm );
router.post('/add', upload.single("image"), DataloggerController.add);
router.get('/editform/:id', DataloggerController.editForm);
router.post('/update/', upload.single("image"), DataloggerController.update);
router.delete('/delete/:id', DataloggerController.deleteById);
router.get('/view/:id', DataloggerController.viewDatalogger);
router.get('/view/:id/channels/:idchannel', DataloggerController.viewChannel);

router.get('/:id/channels/add', DataloggerController.registerChannelForm);
router.post('/:id/channels/add', upload.single("image"), DataloggerController.addChannel);
router.get('/:id/channels/:channelid/update', DataloggerController.updateChannelForm);
router.post('/:id/channels/:channelid/update', upload.single("image"), DataloggerController.updateChannel);

router.post('/location/add', LocationController.addDataloggerLocation);
router.delete('/location/delete/:id', LocationController.deleteDataloggerById);


module.exports = router;
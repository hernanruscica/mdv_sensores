const express = require('express');
const DataloggerController = require('../controllers/DataloggerController.js');

const multer = require('multer');
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



module.exports = router;
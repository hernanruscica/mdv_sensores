const express = require('express');
const AlarmController = require('../controllers/AlarmController');

var router = express.Router();

router.get('/all', AlarmController.all);
router.get('/:id', AlarmController.getById);
router.post('/add', AlarmController.add);
router.put('/update/:id', AlarmController.update);
router.delete('/delete/:id', AlarmController.delete);

router.post('/:id/users/:iduser/add', AlarmController.addUserOnAlarm);
router.get('/users/all', AlarmController.getAllUsersOnAlarms);
router.get('/:id/users/all', AlarmController.getUsersByAlarmId);



module.exports = router;
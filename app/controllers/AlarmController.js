
const AlarmModel = require('../models/AlarmModel');

module.exports = {
    all: async (req, res) => {
        const allAlarms = await AlarmModel.getAll();
        return res.status(200).json({message: 'here loads viewAlarms.ejs', alarms: allAlarms});
    },
    getById: async (req, res) => {
        const {id} = req.params;
        const alarmData = await AlarmModel.getById(id);
        if (alarmData.length > 0){
            return res.status(200).json({message: 'alarm founded', data: alarmData});
        }else{
            return res.status(400).json({message: 'alarm NOT founded'});
        }
    },
    add: async (req, res) => {
        const {channelId, table, column, name, description, max, min, timePeriod} = req.body
        const data = {channelId, table, column, name, description, max, min, timePeriod};
        const addedAlarm = await AlarmModel.add(data);

        //segun resultados, redirije a sweetalert con el mensaje correspondiente
        if (addedAlarm.insertId == -1){
            return res.status(400).json({message: addedAlarm.message, data: data, error: addedAlarm.error ? addedAlarm.error : null});
        }else{
            return res.status(200).json({message: addedAlarm.message, data: data, addedAlarmId: addedAlarm.insertId}); 
        }
               
    },
    update: async (req, res) => {
        const alarmId = req.params.id;
        const {channelId, table, column, name, description, max, min, state, timePeriod} = req.body
        const data = {channelId, table, column, name, description, max, min, state, timePeriod};

        const updatedAlarm = await AlarmModel.update(data, alarmId);
        console.log(updatedAlarm);
        if (updatedAlarm.insertId !== -1 ) {
            return res.status(200).json({message: "update - data received and updated the registry", data: data, alarmId: alarmId});
        }else{
            return res.status(200).json({message: "update - data received but NOT updated", data: data, alarmId: alarmId, updatedAlarm: updatedAlarm});
        }
        
    },
    delete: async (req, res) => {
        const alarmId = req.params.id;
        const deletedAlarm = await AlarmModel.delete(alarmId);
        if (deletedAlarm.affectedRows > 0){
            return res.status(200).json({message: 'delete - id received and alarm deleted', deletedAlarmId: alarmId});
        }else{
            return res.status(400).json({message: 'delete - id received but alarm NOT deleted', deletedAlarmId: alarmId});
        }        
    },
    addUserOnAlarm: async (req, res) => {
        const {id, iduser} = req.params;
        const newUserOnAlarm = await AlarmModel.addUserOnAlarm(iduser, id);
        if (newUserOnAlarm.value != null){
            return res.status(200).json({message: 'Add User on Alarm - data received and new user on alarm added', newUserOnAlarmId: newUserOnAlarm.insertId});
        }else{
            return res.status(400).json({message: newUserOnAlarm.message, userId: iduser, alarmId: id});
        }  
    },
    getAllUsersOnAlarms: async (req, res) => {
        const allUsersOnAlarms = await AlarmModel.getAllUsersOnAlarms();
        if (allUsersOnAlarms.length > 0){
            return res.status(200).json({message: 'OK', data: allUsersOnAlarms});
        }else{
            return res.status(400).json({message: 'not found'});
        }
    },
    getUsersByAlarmId: async (req, res) => {
        const {id} = req.params;
        const usersByAlarmId = await AlarmModel.getUsersByAlarmId(id);
        if (usersByAlarmId.length > 0){
            return res.status(200).json({message: 'OK', data: usersByAlarmId});
        }else{
            return res.status(400).json({message: 'not found'});
        }
    },
    getAllAlarmLogs: async (req, res) => {
        const allAlarmLogs = await AlarmModel.getAllAlarmLogs();
        if (allAlarmLogs.length > 0){
            return res.status(200).json({message: 'OK', data: allAlarmLogs});
        }else{
            return res.status(400).json({message: 'not found'});
        }        
    },
    getAllAlarmLogsByUser: async (req, res) => {
        const {id} = req.params;
        const allAlarmLogsByUser = await AlarmModel.getAllAlarmLogsByUser(id);
        if (allAlarmLogsByUser.length > 0){
            return res.status(200).json({message: 'OK', data: allAlarmLogsByUser});
        }else{
            return res.status(400).json({message: 'not found'});
        }        
    },
    getAllAlarmLogsByChannel: async (req, res) => {
        const {id} = req.params;
        const allAlarmLogsByChannelId = await AlarmModel.getAllAlarmLogsByChannel(id);
        if (allAlarmLogsByChannelId.length > 0){
            return res.status(200).json({message: 'OK', data: allAlarmLogsByChannelId});
        }else{
            return res.status(400).json({message: 'not found'});
        }        
    }
}

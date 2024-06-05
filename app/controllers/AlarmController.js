
const AlarmModel = require('../models/AlarmModel');
const fechas = require('../utils/fechas');

module.exports = {
    all: async (req, res) => {
        const allAlarms = await AlarmModel.getAll();
        return res.status(200).json({message: 'here loads viewAlarms.ejs', alarms: allAlarms});
    },
    getById: async (req, res) => {
        const {id} = req.params;
        const results = await AlarmModel.getById(id);        
        const alarmData = results[0];
        console.log(alarmData)
        const alarmLogsOnCurrentChannel = await AlarmModel.getAllAlarmLogsByChannel(alarmData.canal_id);
        
        if (results.length > 0){
            //return res.status(200).json({message: 'alarm founded', alarmData: alarmData, alarmLogs: alarmLogsOnCurrentChannel});
            return res.render('alarmLogs', {user: req.session.user, 
                                            alarmData: alarmData, 
                                            formatearFecha: fechas.formatearFecha,
                                            alarmLogs: alarmLogsOnCurrentChannel});
        }else{
            return res.status(400).json({message: 'alarm NOT founded'});
        }
    },
    add: async (req, res) => {
        const {dataloggerid, channelid, userid, table, column, name, description, max, min, timeperiod} = req.body
        const data = {channelid, table, column, name, description, max, min, timeperiod};
        //console.log(data);
        const addedAlarm = await AlarmModel.add(data);
        
        const addedUserToAlarm = await AlarmModel.addUserOnAlarm(userid, addedAlarm.insertId);
        console.log(addedUserToAlarm);
        //segun resultados, redirije a sweetalert con el mensaje correspondiente
        if (addedAlarm.insertId != -1 && addedUserToAlarm.value.insertId != -1){
            console.log('envio message de alarma agregada');    
             //return res.status(200).json({message: `Alarma ${data.name} agregada!`, data: data, addedAlarmId: addedAlarm.insertId, dataloggerid: dataloggerid, channelid: channelid}); 
             res.render('messages', {results: 'alarmaagregada', message: `Alarma ${data.name} agregada!`, dataloggerid: dataloggerid, channelid: channelid });
        }else{
            res.status(400).json({message: addedAlarm.message, data: data, error: addedAlarm.error ? addedAlarm.error : null});
        }
               
    },
    update: async (req, res) => {
        const alarmId = req.params.id;
        const {dataloggerid, channelid, table, column, name, description, max, min, state, timeperiod} = req.body
        const data = {channelid, table, column, name, description, max, min, state, timeperiod};        
        const updatedAlarm = await AlarmModel.update(data, alarmId);
        //console.log(req.body);
        if (updatedAlarm.insertId !== -1 ) {
            //return res.status(200).json({message: "update - data received and updated the registry", data: data, alarmId: alarmId});
            return res.render('messages', {results: 'alarmaeditada', message: `Alarma ${name} editada!`, dataloggerid: dataloggerid, channelid: channelid });
        }else{
            return res.status(200).json({message: "update - data received but NOT updated", data: data, alarmId: alarmId, updatedAlarm: updatedAlarm});
        }
        
    },
    //updateState
    updateState: async (req, res) => {
        const alarmId = req.params.id;
        const {nombre, estado, datalogger_id, channel_id} = req.body         
        const updatedAlarm = await AlarmModel.updateState(estado, alarmId);
        console.log(req.body);
        if (updatedAlarm.insertId !== -1 ) {
            //return res.status(200).json({message: "update - data received and updated the registry", data: data, alarmId: alarmId});
            return res.render('messages', {results: 'alarmaeditada', message: `Alarma ${nombre} editada!`, dataloggerid: datalogger_id, channelid: channel_id });
        }else{
            return res.status(200).json({message: "update - data received but NOT updated", state: state, alarmId: alarmId, updatedAlarm: updatedAlarm});
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

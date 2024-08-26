const cron = require('node-cron');
const DataModel = require('../models/DataModel');
const AlarmModel = require('../models/AlarmModel');
//const DatalogerModel = require('../models/DatalogerModel');
const mail = require('../utils/mail');


const alarmDigPorEnc = async () => {
  
  const alarmas = await AlarmModel.getAll();
  //const canales = await DatalogerModel.getChannelsById()
  
  console.log(alarmas.length > 0 ? '\n**************************************************\n' : 'no hay alarmas vigentes');
  //console.log('Fecha y hora',new Date().toString());
  alarmas.forEach(async alarma =>  {
    
    const dataDigital = await DataModel.getDigital(alarma.tabla, alarma.columna, "5 MINUTE", `1 HOUR`);        
    const avg = dataDigital.length > 0 ? dataDigital[dataDigital.length - 1].porc_encendido : 0; 

    console.log(`ID: ${alarma.id} - ${alarma.nombre}: - MAX: ${alarma.max} -  Ultimo % de encendido: ${avg}`);  

    if (avg > alarma.max) {
      console.log(`${alarma.nombre}: Porc de encendido mayor a ${alarma.max}`);      
      //Envia correos si tiene usuarios asignados
      const results = await AlarmModel.getUsersByAlarmId(alarma.id);
      
      if (results.length > 0){
        const emailsCurrentAlarm = [...results.map(result => result.email)];      
        const userIdsCurrentAlarm = [...results.map(result => result.id)];

        console.log('usersIdCurrentAlarm: ', userIdsCurrentAlarm)
        const emailsString = emailsCurrentAlarm.join(', ');    
        console.log('emails string : ', emailsString, '\n'); 

        const mailsSendedOk = await mail.sendAlarm(avg, alarma, emailsString);  

        
        if (!mailsSendedOk) {
          console.log(`Error enviando los correos a ${emailsString}`);
          return 
        }
        console.log(`Correos de alarma enviados a: ${emailsString}`);
        
        //Inserto el log de alarma - 
        userIdsCurrentAlarm.forEach(async userId => {
          const resultsLog = await AlarmModel.addAlarmLog(alarma.id, userId, alarma.canal_id, avg);
          console.log((resultsLog.affectedRows > 0) ? 'Log insertado' : 'Log NO insertado');
        })
      }else{
        console.log('Usuarios asignados NO encontrados!')
      }       
        
    }else{
      console.log('Ultimo porcentaje NO sobrepasa el maximo.')
    }
  });  

  //Checks if the channels passed as parameters has been working together - d1 or d2 (most of the time) on the given table...
  // ('guemes', ['d1', 'd2'])
  const checkAlarmMultipleChannels = async (table, channels, emailsString, text) => {    
    let dataDigital = await DataModel.getDigital(table, channels[0], "5 MINUTE", `1 HOUR`);        
    const channel01Working = parseFloat(dataDigital[0]?.porc_encendido) > 0 || false; 
    dataDigital = await DataModel.getDigital(table, channels[0], "5 MINUTE", `1 HOUR`);        
    const channel02Working = parseFloat(dataDigital[0]?.porc_encendido) > 0 || false; 
    const bothWorking = channel01Working && channel02Working
    console.log(bothWorking);
    if (bothWorking){
      mail.sendAlarmTest(table, emailsString, text);
    }
  }

  
  // Checks if there is a 1 on the servicio atributte, if this is the case, email will be sended
  const checkAlarmService = async (table, emailsString, text) => {     
    const dataDigital = await DataModel.getDigital(table, 'd1',  "5 MINUTE", `1 HOUR`);        
    //console.log(dataDigital[0].servicio);
    const onService = dataDigital[0]?.servicio !== 0 || false;     
     if (onService){
       mail.sendAlarmTest(table, emailsString,text);
     }
  }


  checkAlarmMultipleChannels('guemes', ['d1', 'd2'], 'chernan80@gmail.com, nor2k@yahoo.com, mdvsensores@gmail.com\n', 'Los dos compresores estan encendidos al mismo tiempo.');
  checkAlarmMultipleChannels('quilmes', ['d1', 'd2'], 'chernan80@gmail.com, nor2k@yahoo.com, mdvsensores@gmail.com\n', 'Los dos compresores estan encendidos al mismo tiempo.');
  checkAlarmService('quilmes', 'chernan80@gmail.com, nor2k@yahoo.com, mdvsensores@gmail.com\n', 'Entrada en el lugar del datalogger');
}

module.exports = {
  taskAlarm: cron.schedule('*/5 * * * *', alarmDigPorEnc)  
};


  
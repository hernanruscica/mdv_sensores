const cron = require('node-cron');
const DataModel = require('../models/DataModel');
const AlarmModel = require('../models/AlarmModel');
const mail = require('../utils/mail');


const alarmDigPorEnc = async () => {
  
  const alarmas = await AlarmModel.getAll();
  console.log(alarmas.length > 0 ? '**************************************************\n' : 'no hay alarmas vigentes');
  alarmas.forEach(async alarma =>  {
    //console.log(alarma);
    const dataDigital = await DataModel.getDigital(alarma.tabla, alarma.columna, alarma.periodo_tiempo);    
    const porcOnLastHour = [...dataDigital.map(data => data.porc_encendido)];
    const sum = porcOnLastHour.reduce((a,c) => a + c, 0);
    const avg =  (sum / porcOnLastHour.length).toFixed(2);


    console.log('Fecha y hora',new Date().toString());
    console.log(`${alarma.nombre}: Porcentaje de encendido (${alarma.periodo_tiempo}): ${avg}`);       

    if (avg > alarma.max) {
      
       //Envia correos si tiene usuarios asginados
    const results = await AlarmModel.getUsersByAlarmId(alarma.id);
    
    if (results.length > 0){
      const emailsCurrentAlarm = [...results.map(result => result.email)];      
      const userIdsCurrentAlarm = [...results.map(result => result.id)];

      const emailsString = emailsCurrentAlarm.join(', ');    
      //console.log('emails string : ', emailsString, '\n'); 

      const mailsSendedOk = await mail.sendAlarm(avg, alarma, emailsString);  

      if (!mailsSendedOk) {
        console.log(`Error enviando los correos a ${emailsString}`);
        return 
      }
     
      //Inserto el log de alarma - 
      userIdsCurrentAlarm.forEach(async userId => {
        const resultsLog = await AlarmModel.addAlarmLog(alarma.id, userId, alarma.canal_id, avg);
        console.log((resultsLog.affectedRows > 0) ? 'Log insertado' : 'Log NO insertado');
      })
    }  
      console.log(`${alarma.nombre}: Porc de encendido mayor a ${alarma.max}`);
    }
  });  
}

module.exports = {
  taskAlarm: cron.schedule('*/5 * * * *', alarmDigPorEnc)  
};


  
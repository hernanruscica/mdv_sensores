const cron = require('node-cron');
const DataModel = require('../models/DataModel');
const AlarmModel = require('../models/AlarmModel');
//const DatalogerModel = require('../models/DatalogerModel');
const mail = require('../utils/mail');


const alarmDigPorEnc = async () => {
  
  const alarmas = await AlarmModel.getAll();
  //const canales = await DatalogerModel.getChannelsById()
  
  console.log(alarmas.length > 0 ? '\n**************************************************\n' : 'no hay alarmas vigentes');
  console.log('Fecha y hora',new Date().toString());
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
}

module.exports = {
  taskAlarm: cron.schedule('*/5 * * * *', alarmDigPorEnc)  
};


  
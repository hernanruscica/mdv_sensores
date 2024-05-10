const cron = require('node-cron');
const DataModel = require('../models/DataModel');
const mail = require('../utils/mail');

module.exports = {    
    taskAlarm: cron.schedule(`*/60 * * * * *`, async  () =>  {       
        console.log('Cada 1 minuto');        
        const dataAnalog = await DataModel.getAnalog('guemes', 'a1', '1 HOUR');
        const tempMaxLastHour = Math.max(...dataAnalog.map(data => data.max))
        console.log('datosa', tempMaxLastHour);         
        if (tempMaxLastHour < 800){
            mail.sendAlarm(tempMaxLastHour);
            console.log('menor que 800');
        }       
      })
}


  
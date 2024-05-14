const cron = require('node-cron');
const DataModel = require('../models/DataModel');
const mail = require('../utils/mail');

module.exports = {
  taskAlarm: cron.schedule('*/5 * * * *', async () => {
      //console.log("Cada 15 segundos");
      const dataDigital = await DataModel.getDigital("guemes", "d2", "1 HOUR");
      const porcOnLastHour = [...dataDigital.map(data => data.porc_encendido)];
      const sum = porcOnLastHour.reduce((a,c) => a + c, 0);
      const avg = sum / porcOnLastHour.length;
      console.log("datosa", Date(), porcOnLastHour, avg);
      if (avg > 45) {
        mail.sendAlarm(avg);
        console.log("porcentaje de encendido mayor a 45");
      }
    })  
};


  
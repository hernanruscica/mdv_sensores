const mysql2 = require('mysql2/promise');

// Configurar el pool de conexiones
const pool = mysql2.createPool({
    host: process.env.DB_DATOS_HOST,
    user: process.env.DB_DATOS_USER,
    password: process.env.DB_DATOS_PASSWORD,
    database: process.env.DB_DATOS_NAME,
    waitForConnections: true, // Esperar si todas las conexiones están en uso
    connectionLimit: 10, // Número máximo de conexiones en el pool
    queueLimit: 0 // Cola de conexiones ilimitada
});

module.exports = {
    
    getDataByChannel: async (table, channel, fecha_inicio, fecha_final) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - getData - ejemplo de fecha_inicio: '2023-08-01' y '2023-09-04'");
        try {            
            const [rows, fields] = await connection.execute(`select fecha, ${channel}_inst AS inst, ${channel}_min AS min, ${channel}_max AS max, ${channel}_cantidad AS cantidad, ${channel}_tiempo AS tiempo from ${table} where fecha >= '${fecha_inicio}' and fecha <= '${fecha_final}' order by fecha desc limit 90000;`);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    //fecha >= CURDATE() - INTERVAL 1 DAY AND fecha < CURDATE() + INTERVAL 1 DAY
    getDataByChannelOneDay: async (table, channel) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - getData - ejemplo de fecha_inicio: '2023-08-01' y '2023-09-04'");
        try {            
            //${channel}_cantidad AS cantidad, ${channel}_tiempo AS tiempo, tiempo_total   => para un  canal digital
            const [rows, fields] = await connection.execute(`select fecha, ${channel}_inst AS inst, ${channel}_min AS min, ${channel}_max AS max  
                                                            from ${table} 
                                                            WHERE fecha >= DATE_SUB('2024-03-16', INTERVAL 1 DAY) AND fecha < DATE_ADD('2024-03-16', INTERVAL 1 DAY)
                                                            order by fecha desc limit 90000;`);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getDataByChannelDigitalOneDay: async (table, channel) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - getData - ejemplo de fecha_inicio: '2023-08-01' y '2023-09-04'");
        try {            
            //${channel}_cantidad AS cantidad, ${channel}_tiempo AS tiempo, tiempo_total   => para un  canal digital
            const [rows, fields] = await connection.execute(`select fecha, ${channel}_estado AS estado, ${channel}_cantidad AS cantidad, ${channel}_tiempo AS tiempo, tiempo_total, servicio, energia, texto  
                                                            from ${table} 
                                                            WHERE fecha >= DATE_SUB('2024-03-16', INTERVAL 1 DAY) AND fecha < DATE_ADD('2024-03-16', INTERVAL 1 DAY)
                                                            ORDER BY fecha ASC LIMIT 288`);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    //Data example: timePeriod = '1 DAY' '1 HOUR'
    getDigital: async (table, channel, timePeriod, timeAvgValue) => {
        const connection = await pool.getConnection();
        //1 HOUR
        const query = `
            SELECT 
                CONVERT_TZ(fecha, '+00:00', '${process.env.UTC_LOCAL}') AS fecha_local,
                ${channel}_estado AS estado,
                ${channel}_cantidad AS cantidad,
                ${channel}_tiempo AS tiempo,
                ${channel}_porc_encendido AS porc_encendido,                
                tiempo_total,
                servicio,
                energia,
                texto
            FROM 
                ${table} AS main
            WHERE 
                fecha >= DATE_SUB(NOW(), INTERVAL ${timePeriod}) AND fecha <= NOW()
            ORDER BY 
                fecha ASC
            LIMIT 288
        `;
        try {
            const [rows, fields] = await connection.execute(query);   
            
            return rows;
        } catch (error) {
            throw error;            
        } finally {
            connection.release();            
        }
    }
       
    ,
    //Data example: timePeriod = '1 DAY' '1 HOUR'
    getAnalog: async (table, channel, timePeriod) => {
        //console.log("getAnalog on dataModel");
        const connection = await pool.getConnection();
        const query =  `select 
                            CONVERT_TZ(fecha, '+00:00', '-03:00') as fecha_local, 
                            servicio, texto,
                            ${channel}_inst AS inst, 
                            ${channel}_min AS min, 
                            ${channel}_max AS max
                        from ${table} 
                        WHERE  
                            fecha >= DATE_SUB(NOW(), INTERVAL ${timePeriod}) AND fecha <= NOW()
                        ORDER BY 
                            fecha ASC 
                        LIMIT 288`   
        try {
            const [rows, fields] = await connection.execute(query);
            return rows;
        } catch (error) {
            throw error;            
        }finally {
            connection.release();            
        }
    }

}
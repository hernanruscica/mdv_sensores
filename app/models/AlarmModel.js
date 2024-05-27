const mysql2 = require('mysql2/promise');
const { insert } = require('./UserModel');

// Configurar el pool de conexiones
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // Esperar si todas las conexiones están en uso
    connectionLimit: 10, // Número máximo de conexiones en el pool
    queueLimit: 0 // Cola de conexiones ilimitada
});

module.exports = {    
    add: async (data) => {
        const connection = await pool.getConnection();
        console.log(`abierta la conexion con el pool de datos - add - alarm ` );
        //console.log(`inserto en la tabla 'alarmas':`, data);
        try {
            const [rows, columns] = await  connection.execute(`insert into alarmas
            (canal_id, tabla, columna, nombre, descripcion, max, min, periodo_tiempo, estado, fecha_creacion)
            values
            ('${data.channelid}', '${data.table}', '${data.column}', 
             '${data.name}', '${data.description}', '${data.max}', '${data.min}', '${data.timeperiod}', true, CURRENT_TIMESTAMP());`);            
             //console.log(rows.affectedRows);
             if (rows.affectedRows > 0){
                return {message: 'Alarm add ok', insertId: rows.insertId}
            }else{
                return {message: 'Alarm add Fails', insertId: -1};
            }         
        } catch (error) {
            console.log(error);
            return {message: 'Alarm added ERROR', insertId: -1, error: error}                        
        }finally{
            connection.release(); 
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getAll: async () => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - Alarmas.getAll");
        try {            
            const [rows, fields] = await connection.execute(`select *
                from alarmas`);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getById: async (id) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - Alarmas.getById");
        try {            
            const [rows, fields] = await connection.execute(`select *
                from alarmas where id = ?`, [id]);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    update: async (data, id) => {
        const connection = await pool.getConnection();
        console.log(`abierta la conexion con el pool de datos - Update - alarm ` );
        //console.log(`inserto en la tabla 'alarmas':`, data);
        try {
            const [rows, columns] = await  connection.execute(`update alarmas
                        set 
                            canal_id = ?,
                            tabla = ?,
                            columna= ?,
                            nombre = ?,
                            descripcion = ?,
                            max = ?,
                            min = ?,
                            periodo_tiempo = ?,
                            estado= ?
                        where id = ?`, [data.channelid, data.table, data.column, data.name, data.description, data.max, data.min, data.timeperiod, data.state, id]);
            

            if (rows.affectedRows > 0){
                return {message: 'Alarm update ok', insertId: rows.insertId}
            }else{
                return {message: 'Alarm update Fails', insertId: -1};
            }        
        } catch (error) {
            console.log(error);
            return {message: 'Alarm update ERROR', insertId: -1, error: error}                        
        }finally{
            connection.release(); 
            console.log("cerrada la conexion con el pool de datos");
        }
    },



    delete: async (id) => {
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - Alarmas.delete");
        try {            
            const [rows, fields] = await connection.execute(`delete from alarmas where id = ${id}`);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }

    },
    addUserOnAlarm: async (userId, alarmId) => {        
        const connection = await pool.getConnection();
        console.log(`abierta la conexion con el pool de datos - add - alarma_x_usuario ` );
        let alarmExist = null;
        try {
            const [filas] = await connection.execute(`SELECT * FROM alarmas_x_usuarios where alarma_id = '${alarmId}' AND usuario_id='${userId}'`);
            alarmExist = filas.length > 0;
            //console.log(alarmExist);
            if (alarmExist) return {value: null, message: 'Alarm already exists on that user'};
            const [rows, columns] = await  connection.execute(`insert into alarmas_x_usuarios
            (alarma_id, usuario_id, fecha_creacion)
            values
            ('${alarmId}', '${userId}', CURRENT_TIMESTAMP());`);

            if (rows.affectedRows > 0){
                return {value: rows, message: 'Alarm asigned to the user'};
            }else{
                return {value: null, message: 'Alarm NOT asigned to the user'};
            }
        
        } catch (error) {
            console.log(error.code);
            //throw error;            
            return {value: null, errorCode: error.code, message: error.code == 'ER_NO_REFERENCED_ROW_2' ? 'Alarm or User id doesnt exists' : error.sqlMessage};
        }finally{
            connection.release(); 
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getAllUsersOnAlarms: async () => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - UserOnAlarm.getAll");
        try {            
            const [rows, fields] = await connection.execute(`select *
                from alarmas_x_usuarios`);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getUsersByAlarmId: async (alarmId) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - AlarmModel.getEmailsByAlarmId");
        try {            
            const [rows, fields] = await connection.execute(`select usuarios.id, usuarios.email, usuarios.nombre_1, usuarios.apellido_1, usuarios.email, usuarios.telefono
                from alarmas_x_usuarios 
                inner join usuarios on usuarios.id = alarmas_x_usuarios.usuario_id
                where alarma_id = ${alarmId}`);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    //No necesitaria un controller, porque uso la funcion directamente en cronjobs, no se dispara desde el front, por eso no necesitaria una ruta y un controller.
    addAlarmLog: async (alarma_id, usuario_id, canal_id, valor) => {        
        const connection = await pool.getConnection();
        console.log(`abierta la conexion con el pool de datos - add - alarm ` );
        //console.log(`inserto en la tabla 'alarmas':`, data);
        try {
            const [rows, columns] = await  connection.execute(`insert into alarmas_logs
            (alarma_id, usuario_id, canal_id, valor, fecha_disparo)
            values
            ('${alarma_id}', '${usuario_id}', '${canal_id}', ${valor}, CURRENT_TIMESTAMP());`);
        return rows;
        } catch (error) {
            console.log(error);
            throw error;            
        }finally{
            connection.release(); 
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getAllAlarmLogs: async () => {
        const connection = await pool.getConnection();
        console.log(`abierta la conexion con el pool de datos - get - Alarm Logs ` ); 
        try {            
            const [rows, columns] = await connection.execute('select * from alarmas_logs;');
            return rows;
        } catch (error) {
            console.log(error);
            throw error;   
        }finally{
            connection.release(); 
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getAllAlarmLogsByUser: async (id) => {
        const connection = await pool.getConnection();
        console.log(`abierta la conexion con el pool de datos - get - Alarm Logs ` ); 
        try {            
            const [rows, columns] = await connection.execute('select * from alarmas_logs where usuario_id = ?;', [id]);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;   
        }finally{
            connection.release(); 
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getAllAlarmLogsByChannel: async (id) => {
        const connection = await pool.getConnection();
        console.log(`abierta la conexion con el pool de datos - get - Alarm Logs ` ); 
        try {            
            const [rows, columns] = await connection.execute('select * from alarmas_logs where canal_id = ?;', [id]);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;   
        }finally{
            connection.release(); 
            console.log("cerrada la conexion con el pool de datos");
        }
    }

}

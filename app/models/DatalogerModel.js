const mysql2 = require('mysql2/promise');

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
    
    getById: async (id) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - Datalogger.getByid");
        try {            
            const [rows, fields] = await connection.execute(`SELECT dataloggers.*,
                                    dataloggers_x_ubicacion.ubicaciones_id as ubicacion_id
                                    FROM dataloggers_x_ubicacion
                                    inner join dataloggers on dataloggers_x_ubicacion.datalogger_id = dataloggers.id
                                    WHERE dataloggers.id  = '${id}'`);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getByLocationId: async (locationId) => {                
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - Datalogger.getByid");
        try {            
            const [rows, fields] = await connection.execute(`select dataloggers.*, dataloggers_x_ubicacion.ubicaciones_id as ubicacion_id
            from dataloggers
            inner join dataloggers_x_ubicacion on dataloggers.id = dataloggers_x_ubicacion.datalogger_id
            where dataloggers_x_ubicacion.ubicaciones_id = ${locationId}`);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getChannelsById: async (id) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - get Channels By Datalogger Id");
        try {            
            const [rows, fields] = await connection.execute(`select canales.id as canal_id, 
            canales.nombre_columna, 
            canales.nombre as canal_nombre, 
            canales.descripcion as canal_descripcion,
            canales.multiplicador,
            canales.tiempo_a_promediar
                from canales
                where datalogger_id = '${id}'`);                  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getAll: async () => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - Datalogger.getAll");
        try {            
            const [rows, fields] = await connection.execute(`select id, direccion_mac, nombre, descripcion, foto, nombre_tabla, fecha_creacion
                from dataloggers`);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    deleteById: async (id) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - deleteById - datalogger");
        try {
            const [rows, fields] = await connection.execute(`DELETE FROM dataloggers  WHERE id = '${id}'`);
            return rows;
        } catch (error){
            console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    add: async (data) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - add - datalogger");
        try {
            const [rows, fields] = await connection.execute(`insert into dataloggers
                                    (direccion_mac, nombre, descripcion, foto, nombre_tabla, fecha_creacion)
                                    values
                                    ('${data.direccion_mac}', '${data.nombre}', '${data.descripcion}', '${data.foto}', '${data.nombre_tabla}', CURRENT_TIMESTAMP());`);
            return rows;
        } catch (error){
            console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    update: async (data) => {
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - updateDatalogger");
        
        try {        
            
            // Actualiza la tabla 'usuarios'
            const [rows, fields  ] = await connection.execute(`UPDATE dataloggers                
                SET
                    nombre = ?,
                    descripcion = ?,
                    direccion_mac = ?,
                    foto = ?,
                    nombre_tabla = ?                                       
                WHERE id = ?`, [data.nombre, data.descripcion, data.direccion_mac, data.foto, data.nombre_tabla, data.id]);
            
           
            console.log("Ubicacion y direccion actualizadas con exito.");
            return true;
        } catch (error) {
            await connection.rollback(); // Revierte la transacción en caso de error
            console.error("Error en la transacción:", error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getChannellbyId: async (id) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - Datalogger.getChannelById");
        try {            
            const [rows, fields] = await connection.execute(`select id, datalogger_id, nombre, descripcion, nombre_columna, tiempo_a_promediar, multiplicador, fecha_creacion, foto
                                                              from mdvsrl.canales where id = ${id};`);  
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    addChannel: async (data) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - add - datalogger");
        try {
            const [rows, fields] = await connection.execute(`insert into canales
                                    (datalogger_id, nombre, descripcion, nombre_columna, tiempo_a_promediar, multiplicador, fecha_creacion, foto)
                                    values
                                    (${data.datalogger_id}, '${data.nombre}', '${data.descripcion}', '${data.nombre_columna}', ${data.tiempo_a_promediar}, ${data.multiplicador}, CURRENT_TIMESTAMP(), '${data.foto}');`);                                    
            return rows;
        } catch (error){
            console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    updateChannel: async (data, id) => {
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - update - channel");
        try {
            const [rows, fields] = await connection.execute(`update canales
                                    set 
                                        nombre = '${data.nombre}', 
                                        descripcion = '${data.descripcion}', 
                                        nombre_columna = '${data.nombre_columna}', 
                                        multiplicador = ${data.multiplicador},
                                        foto = '${data.foto}'
                                    where id = '${id}';`);                                    
            return rows;
        } catch (error){
            console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    }
}
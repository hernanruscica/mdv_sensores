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
    add: async (data) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - insert");
        
         try {
             const [rows, fields] = await connection.execute(`INSERT INTO ubicaciones (nombre, descripcion, foto, telefono, email, fecha_creacion, direcciones_id)         
             VALUES ('${data.nombre}', '${data.descripcion}', '${data.foto}', '${data.telefono}', '${data.email}', CURDATE(), '${data.direcciones_id}')`);
             console.log(`Rows affeted: ${rows.affectedRows}`);
             return rows;
         } catch (error){                       
             throw error;
         } finally {
             connection.release(); 
             console.log("cerrada la conexion con el pool de datos");
         }
    },
    addLocationUserRole: async (data) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - insert de addLocationUserRole");
        
         try {
             const [rows, fields] = await connection.execute(`INSERT INTO usuarios_x_ubicaciones_x_roles (usuarios_id, ubicaciones_id, roles_id, fecha_creacion)         
             VALUES ('${data.usuarios_id}', '${data.ubicaciones_id}', '${data.roles_id}', CURDATE())`);
             //console.log(`Rows affeted: ${rows.affectedRows}`);
             return rows;
         } catch (error){                       
             throw error;
         } finally {
             connection.release(); 
             console.log("cerrada la conexion con el pool de datos");
         }
    },
    getAll: async () => {
        //conn.query(`SELECT * FROM users`, myFunction);
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - getAll Locations");
        try {            
            const [rows, fields] = await connection.execute(`SELECT * FROM ubicaciones;`);            
            //console.log(rows)
            return rows;
        }catch (error){
            console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getById: async (id) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - Location getById");
        try {            
            const [rows, fields] = await connection.execute(`SELECT ubicaciones.id, ubicaciones.nombre, ubicaciones.descripcion, ubicaciones.telefono, ubicaciones.email, ubicaciones.foto, ubicaciones.direcciones_id, 
                direcciones.calle, direcciones.numero, direcciones.localidad, direcciones.partido, direcciones.provincia 
                FROM ubicaciones 
                INNER JOIN direcciones ON ubicaciones.direcciones_id = direcciones.id
                WHERE ubicaciones.id = '${id}'`);  
             
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getDataloggersByLocationId: async (locationId) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - Location getById");
        try {            
            const [rows, fields] = await connection.execute(`SELECT mdvsrl.dataloggers_x_ubicacion.datalogger_id 
            FROM mdvsrl.dataloggers_x_ubicacion
            INNER JOIN mdvsrl.ubicaciones ON  mdvsrl.dataloggers_x_ubicacion.ubicaciones_id = mdvsrl.ubicaciones.id
            WHERE mdvsrl.ubicaciones.id = ${locationId};`);              
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    //Estas no la puedo hacer porque la consulta dice que tiene un constraint con usuarios_ubicaciones_roles
    deleteById: async (id) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - deleteById - location");
        try {
            const [rows, fields] = await connection.execute(`DELETE FROM ubicaciones  WHERE id = '${id}'`);
            return rows;
        } catch (error){
            console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    updateLocation: async (data) => {
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - updateLocation");
        
        try {
            await connection.beginTransaction(); // Inicia la transacción
            
            // Actualiza la tabla 'usuarios'
            await connection.execute(`UPDATE ubicaciones
                SET
                    nombre = ?,
                    descripcion = ?,
                    telefono = ?,
                    foto = ?,
                    email = ?                    
                WHERE id = ?`, [data.nombre, data.descripcion, data.telefono, data.foto, data.email, data.id]);
            
            // Actualiza la tabla 'direcciones'
            await connection.execute(`UPDATE direcciones
                SET
                    calle = ?,
                    numero = ?,
                    localidad = ?,
                    partido = ?,
                    provincia = ?,
                    fecha_creacion = CURDATE()
                WHERE id = ?`, [data.calle, data.numero, data.localidad, data.partido, data.provincia, data.direcciones_id]);
            
            await connection.commit(); // Confirma la transacción
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
    }

}

/*
Error Code: 1054. Unknown column 'mdvsrl.ubicaciones.id' in 'where clause'

*/
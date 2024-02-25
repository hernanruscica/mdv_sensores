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
        console.log("abierta la conexion con el pool de datos - insert Location");

        const dataDireccion = {
            calle: (data !== null && data.calle) ? data.calle  : 'calle false',
            numero: (data !== null && data.numero) ? data.numero  : 1234,
            localidad: (data !== null && data.localidad) ? data.localidad  : "0",
            partido: (data !== null && data.partido) ? data.partido  : "0",
            provincia: (data !== null && data.provincia) ? data.provincia  : "06",
            codigo_postal: 0,
            latitud: 0,
            longitud: 0
          }

        try {            
            const [rows, fields] = await connection.execute(`insert into direcciones
            (calle, numero, localidad, partido, provincia, codigo_postal, latitud, longitud, fecha_creacion )
        values
            ('${dataDireccion.calle}', '${dataDireccion.numero}', '${dataDireccion.localidad}', '${dataDireccion.partido}', '${dataDireccion.provincia}', '${dataDireccion.codigo_postal}', '${dataDireccion.latitud}', '${dataDireccion.longitud}', curdate());`);            
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
    
    getAll: async () => {
        //conn.query(`SELECT * FROM users`, myFunction);
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - getAll Locations");
        try {            
            const [rows, fields] = await connection.execute(`SELECT * FROM direcciones;`);            
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
    
    //lo de abajo, no lo revise 
    getById: async (id) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - Location getById");
        try {            
            const [rows, fields] = await connection.execute(`SELECT ubicaciones.id, ubicaciones.nombre, ubicaciones.telefono, ubicaciones.foto, direcciones.calle, direcciones.numero, direcciones.localidad 
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
    }
}
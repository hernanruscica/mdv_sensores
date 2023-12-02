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
    getById: async (table, id) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - getByid");
        try {            
            const [rows, fields] = await connection.execute(`SELECT fecha, tiempo_total, d1_estado, d1_cantidad, d1_tiempo
             FROM ${table}              
             WHERE indice = ${id}`);  
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
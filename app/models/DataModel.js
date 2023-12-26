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
    
    getData: async (table, fecha_inicio, fecha_final) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - getData - ejemplo de fecha_inicio: '2023-08-01' y '2023-09-04'");
        try {            
            const [rows, fields] = await connection.execute(`select * from ${table} where fecha >= '${fecha_inicio}' and fecha <= '${fecha_final}' order by fecha desc limit 90000;`);  
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
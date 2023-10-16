

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

    insert: async (data) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - insert");

        
         try {
             const [rows, fields] = await connection.execute(`INSERT INTO usuarios (nombre_1, nombre_2, apellido_1, apellido_2, dni, foto, email, password, telefono, estado, fecha_creacion, direcciones_id)         
             VALUES ('${data.nombre_1}', '${data.nombre_1}', '${data.apellido_1}', '${data.apellido_2}', '${data.dni}', '${data.foto}', '${data.email}', '${data.password}', '${data.telefono}', '${data.estado}', CURDATE(), '${data.direcciones_id}')`);
             console.log(`Rows affeted: ${rows.affectedRows}`);
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
        console.log("abierta la conexion con el pool de datos - getAll");
        try {            
            const [rows, fields] = await connection.execute(`SELECT * FROM usuarios;
            `);            
            console.log(rows)
            return rows;
        }catch (error){
            console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    getByDni: async (dni) => {        
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - getById");
        try {
            const [rows, fields] = await connection.execute(`SELECT nombre_1, apellido_1, dni, foto, password, email, estado FROM usuarios WHERE dni = '${dni}'`);
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    },
    updateState: async (dni, state) => {
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - updateState");
        try {
            const [rows, fields] = await connection.execute(`UPDATE usuarios SET estado = '${state}' WHERE dni = '${dni}'`);
            return rows;
        } catch (error){
            //console.error(error);
            throw error;
        } finally {
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
        
    },
    updatePassword: async (dni, password) => {
        const connection = await pool.getConnection();
        console.log("abierta la conexion con el pool de datos - updateState");
        try {
            const [rows, fields] = await connection.execute(`UPDATE usuarios SET password = '${password}' WHERE dni = '${dni}'`);
            return rows;
        }catch(error){
            throw error;
        } finally{
            connection.release(); // Liberar la conexión de vuelta al pool cuando hayas terminado
            console.log("cerrada la conexion con el pool de datos");
        }
    }
}
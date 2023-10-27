module.exports = {

 convertJson : async () => {
    try {
        // Usa fetch para cargar el archivo JSON
        const response = await fetch("../utils/localidades.json");

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON.');
        }

        // Convierte la respuesta a JSON
        const localidades = await response.json();

        // Crea un nuevo arreglo con los atributos deseados
        const nuevoFormato = localidades.map(localidad => {
            return {
                nombre: localidad.nombre,
                municipio: localidad.municipio.nombre,
                provincia: localidad.provincia.nombre
            };
        });

        // Devuelve el resultado como JSON
        return JSON.stringify(nuevoFormato, null, 2);
    } catch (error) {
        // Maneja errores
        console.error('Error:', error);
        return null;
    }
}

} 


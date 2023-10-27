const fs = require('fs');

const convertJson = () =>  {
        // Lee el archivo JSON
        const rawData = fs.readFileSync('localidades.json');
        const localidades = JSON.parse(rawData);

        // Crea un nuevo arreglo con los atributos deseados
        const nuevoFormato = localidades.map(localidad => {
            return {
                nombre: localidad.nombre,
                municipio: localidad.municipio.nombre,
                provincia: localidad.provincia.nombre
            };
        });

        // Convierte el nuevo arreglo a formato JSON
        const nuevoJSON = JSON.stringify(nuevoFormato, null, 2);

        // Guarda el nuevo archivo JSON
        fs.writeFileSync('nuevoLocalidades.json', nuevoJSON);
    }
    
console.log("desde localidades")
   // convertJson();



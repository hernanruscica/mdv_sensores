//Carga nombres y ids de provincias, departamentos y localidades.
import data from './data.js';

function obtenerNombreProvincia(idProvincia) {
    // Buscar la provincia con el ID correspondiente
    const provinciaEncontrada = data.provincias.find(provincia => provincia.id === idProvincia);
    // Si se encuentra la provincia, devolver su nombre; de lo contrario, devolver null
    return provinciaEncontrada ? provinciaEncontrada.nombre : null;
}

function obtenerNombrePartido(idPartido) {  
    const partidoEncontrado = data.departamentos.find(departamento => departamento.id === idPartido);    
    return partidoEncontrado ? partidoEncontrado.nombre : null;
}

function obtenerNombreLocalidad(idLocalidad) {  
    const localidadEncontrada = data.localidades.find(localidad => localidad.id === idLocalidad);    
    return localidadEncontrada ? localidadEncontrada.nombre : null;
}

document.addEventListener('DOMContentLoaded', () => {
    const provinciaId = document.getElementById("provincia_id").value;
    const partidoId = document.getElementById("partido_id").value;
    const localidadId = document.getElementById("localidad_id").value;
    const nombreProvincia = obtenerNombreProvincia(provinciaId);
    const nombrePartido = obtenerNombrePartido(partidoId);
    const nombreLocalidad = obtenerNombreLocalidad(localidadId);
    document.getElementById("provincia_nombre").innerHTML = `<strong>Provincia: </strong>${nombreProvincia}` ;
    document.getElementById("partido_nombre").innerHTML = `<strong>Partido: </strong>${nombrePartido}` ;
    document.getElementById("partido_localidad").innerHTML = `<strong>Localidad: </strong>${nombreLocalidad}` ;
    console.log(`desde mostrarNombresDireccion.mjs\n${provinciaId}\n${nombreProvincia}`);
});

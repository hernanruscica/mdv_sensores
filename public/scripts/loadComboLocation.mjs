//Carga nombres y ids de provincias, departamentos y localidades.
import data from './data.js';


//console.log(data.provincias[0], data.departamentos[0], data.localidades[0]);
console.log("Cargando los combo box de las direcciones desde el modulo loadComboLocation.mjs");


const provinciasSelect = document.getElementById("provincia");
const partidosSelect = document.getElementById("partido");
const localidadesSelect = document.getElementById("localidad");
const provinciaId = document.getElementById("provincia_id").value;
const partidoId = document.getElementById("partido_id").value;
const localidadId = document.getElementById("localidad_id").value;

// Función para llenar el combo box de provincias
export const llenarProvincias = () => {
    console.log("llenar provincias")
    data.provincias.forEach(provincia => {
        const option = document.createElement("option");
        option.value = provincia.id;
        option.text = provincia.nombre;
        provinciasSelect.appendChild(option);
    });

    provinciasSelect.value = provinciaId;

    console.log(provinciaId, partidoId, localidadId);
};

// Función para llenar el combo box de partidos
function llenarPartidos(provinciaId) {
    // Limpiar partidosSelect
    partidosSelect.innerHTML = '<option value="" disabled selected>Seleccione un partido</option>';

    const departamentosEncontradosPorProv = data.departamentos.filter((departamento) => departamento.provId == provinciaId);
    //console.log(departamentosEncontradosPorProv);

    if (departamentosEncontradosPorProv) {
        departamentosEncontradosPorProv.forEach(partido => {
            const option = document.createElement("option");
            option.value = partido.id;
            option.text = partido.nombre;
            partidosSelect.appendChild(option);
        });
        partidosSelect.disabled = false;
        partidosSelect.value = partidoId;
    } else {
        partidosSelect.disabled = true;
        localidadesSelect.disabled = true;
    }
};

// Función para llenar el combo box de localidades
function llenarLocalidades(partidoId) {
    // Limpiar localidadesSelect
    localidadesSelect.innerHTML = '<option value="" disabled selected>Seleccione una localidad</option>';

    const localidadesEncontradasPorDepartamento = data.localidades.filter((localidad) => localidad.departamentoId == partidoId);
    //console.log(localidadesEncontradasPorDepartamento);

    if (localidadesEncontradasPorDepartamento) {
        localidadesEncontradasPorDepartamento.forEach(localidad => {
            const option = document.createElement("option");
            option.value = localidad.id;
            option.text = localidad.nombre;
            localidadesSelect.appendChild(option);
        });
        localidadesSelect.disabled = false;
        localidadesSelect.value = localidadId;
    } else {
        localidadesSelect.disabled = true;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Llenar combo box de provincias al cargar la página
    llenarProvincias();
    llenarPartidos(provinciaId);
    llenarLocalidades(partidoId);
  });

  // Agregar evento de cambio a provinciasSelect
  provinciasSelect.addEventListener("change", () => {
      const provinciaId = provinciasSelect.value;
      llenarPartidos(provinciaId);
  });

  // Agregar evento de cambio a partidosSelect
  partidosSelect.addEventListener("change", () => {
      const partidoId = partidosSelect.value;
      llenarLocalidades(partidoId);
  });



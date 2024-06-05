console.log("desde userFunctionsBtns.js script");
const $d = document;

const copiarEnMemoria = (value) => {        
    navigator.clipboard.writeText(value)
        .then(() => {
        console.log(`Text copied to clipboard... ${value}`)
    })
        .catch(err => {
        console.log('Something went wrong', err);
    })
}
const eliminarUsuario = (dni, nombre, apellido) => {
    console.log(`Eliminar usuario con DNI.: ${dni} ?`);
    Swal.fire({
        title: 'Eliminar usuario.',
        text: `Confirma la eliminación del usuario ${nombre} ${apellido} con D.N.I.: ${dni} ? Esta acción no se puede deshacer`,
        icon: 'warning',                   
        showDenyButton: true,                               
        confirmButtonText: 'Eliminar',
        confirmButtonColor: '#FF0000',
        denyButtonText: 'Conservar',
        denyButtonColor: '#28DC25'

    }).then((result) => {
        if (result.value) {            
            fetch(`/users/${dni}`, { method: 'DELETE' })
            .then(response => {
                // manejar respuesta exitosa    
                Swal.fire({
                    title: 'Usuario eliminado !',
                    text: `Se eliminó al usuario ${nombre} ${apellido} con exito.`,
                    icon: 'info',
                    confirmButtonText: 'Entendido'
                }).then((result) => { 
                    if (result.value){
                        //location.reload();    
                        window.location.href = '/users/all' ;    
                    }
                }); 
            })
            .catch(error => {
                // manejar error
                console.log("error al borrar el elemento", error);
            });
        }
    })            
}

const eliminarUbicacion = (id, nombre) => {
    console.log(`Eliminar ubicacion con ID.: ${id} ?`);
    Swal.fire({
        title: 'Eliminar ubicación.',
        text: `Confirma la eliminación de la ubicación ${nombre} ? Esta acción no se puede deshacer`,
        icon: 'warning',                   
        showDenyButton: true,                               
        confirmButtonText: 'Eliminar',
        confirmButtonColor: '#FF0000',
        denyButtonText: 'Conservar',
        denyButtonColor: '#28DC25'

    }).then((result) => {
         if (result.value) {            
             fetch(`/locations/delete/${id}`, { method: 'DELETE' })
             .then(response => {
                 // manejar respuesta exitosa    
                 Swal.fire({
                     title: 'Ubicacion eliminada !',
                     text: `Se eliminó la ubicacion ${nombre} con exito.`,
                     icon: 'info',
                     confirmButtonText: 'Entendido'
                 }).then((result) => { 
                     if (result.value){
        //                 //location.reload();    
                         window.location.href = '/locations/all' ;    
                     }
                 }); 
             })
             .catch(error => {
                 // manejar error
         console.log("error al borrar el elemento", error);
     });
 }
        window.location.href = '/locations/all' ;
    })            
}

const eliminarDatalogger = (id, nombre) => {
  console.log(`Eliminar datalogger con ID.: ${id} ?`);
  Swal.fire({
    title: "Eliminar datalogger.",
    text: `Confirma la eliminación del datalogger ${nombre} ? Esta acción no se puede deshacer`,
    icon: "warning",
    showDenyButton: true,
    confirmButtonText: "Eliminar",
    confirmButtonColor: "#FF0000",
    denyButtonText: "Conservar",
    denyButtonColor: "#28DC25",
  }).then((result) => {
    if (result.value) {
      fetch(`/dataloggers/delete/${id}`, { method: "DELETE" })
        .then((response) => {
          // manejar respuesta exitosa
          Swal.fire({
            title: "Datalogger eliminado !",
            text: `Se eliminó el datalogger ${nombre} con exito.`,
            icon: "info",
            confirmButtonText: "Entendido",
          }).then((result) => {
            if (result.value) {
              window.location.href = "/dataloggers/all";
            }
          });
        })
        .catch((error) => {
          // manejar error
          console.log("error al borrar el elemento", error);
        });
    } else if (result.dismiss === Swal.DismissReason.deny) {
      Swal.close(); // Cerrar SweetAlert
    }
  });
};

const desasociarDatalogger = (idDataloggerUbicacion, nombredatalogger, nombreUbicacion, idUbicacion ) => {
  console.log(`Desasociar datalogger con ID.: ${idDataloggerUbicacion} ?`);
  Swal.fire({
    title: "Desasociar datalogger.",
    text: `¿Confirma la desasociación del datalogger '${nombredatalogger}'\nNo estará más asociado a ${nombreUbicacion} ?\n Esta acción no se puede deshacer`,
    icon: "warning",
    showDenyButton: true,
    confirmButtonText: "Confirmar",
    confirmButtonColor: "#FF0000",
    denyButtonText: "Conservar",
    denyButtonColor: "#28DC25",
  }).then((result) => {
    if (result.value) {
      fetch(`/dataloggers/location/delete/${idDataloggerUbicacion}`, { method: "DELETE" })
        .then((response) => {
          // manejar respuesta exitosa
          Swal.fire({
            title: "Datalogger desasociado !",
            text: `Se desasoció el datalogger ${nombredatalogger} a la ubicacion ${nombreUbicacion} con exito.`,
            icon: "info",
            confirmButtonText: "Entendido",
          }).then((result) => {
            if (result.value) {
              window.location.href = `/locations/view/${idUbicacion}`;
            }
          });
        })
        .catch((error) => {
          // manejar error
          console.log("error al borrar el elemento", error);
        });
    } else if (result.dismiss === Swal.DismissReason.deny) {
        Swal.close(); // Cerrar SweetAlert
    }
  });
};

const eliminarAlarma = (e) => {
  console.log(`Confirma la eliminacion de la alarma "${e.target.dataset.nombre}" con id: "${e.target.dataset.alarm_id}"`);
  Swal.fire({
    title: 'Eliminar Alarma.',
    text: `Confirma la eliminación de la alarma ${e.target.dataset.nombre} ? Puede volverla a activar en la pagina de alarmas para este canal.`,
    icon: 'warning',                   
    showDenyButton: true,                               
    confirmButtonText: 'Eliminar',
    confirmButtonColor: '#FF0000',
    denyButtonText: 'Conservar',
    denyButtonColor: '#28DC25'

}).then((result) => {
     if (result.value) {     
      const data = {
        estado: false,
        nombre: e.target.dataset.nombre,
        datalogger_id: e.target.dataset.datalogger_id,
        channel_id: e.target.dataset.channel_id
      };      
      fetch(`/alarms/updatestate/${e.target.dataset.alarm_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => {
             // manejar respuesta exitosa    
             Swal.fire({
                 title: 'Alarma eliminada !',
                 text: `Se eliminó la alarma ${e.target.dataset.nombre} con exito.`,
                 icon: 'info',
                 confirmButtonText: 'Entendido'
             }).then((result) => { 
                 if (result.value){
    //                 //location.reload();    
                     window.location.href = `/dataloggers/view/${e.target.dataset.datalogger_id}/channels/${e.target.dataset.channel_id}` ;    
                 }
             }); 
         })
         .catch(error => {
             // manejar error
     console.log("error al borrar el elemento", error);
 });
}
    //window.location.href = '/dataloggers/view/1/channels/11' ;
})  
}

const editarAlarma = (e) =>{
  //console.log(`Dispara modal para editar la alarma con id: ${e.target.dataset.name}`);
  var myModal = new bootstrap.Modal(document.getElementById('modal_editar_alarmas'));
  myModal.show();  
  document.getElementById("dataloggerid").value = e.target.dataset.dataloggerid;
  document.getElementById("channelid").value = e.target.dataset.channelid;
  document.getElementById("table").value = e.target.dataset.table;
  document.getElementById("column").value = e.target.dataset.column;
  document.getElementById("state").value = e.target.dataset.state;
  document.getElementById("name").value = e.target.dataset.name;
  document.getElementById("description").value = e.target.dataset.description;  
  document.getElementById("max").value = e.target.dataset.max;
  document.getElementById("min").value = e.target.dataset.min;
  document.getElementById("timeperiod").value = e.target.dataset.timeperiod;  
  
  document.getElementById("modal_editar_alarmas_form").setAttribute("action", `/alarms/update/${e.target.dataset.id}`) ;
}

const agregarAlarma = (e) => {
  //console.log(`Click en el boton de ${e.target.id} y muestro modal para agregar una nueva alarma`);
  var myModal02 = new bootstrap.Modal(document.getElementById('modal_agregar_alarmas'));
  myModal02.show();  
  document.getElementById("dataloggerid02").value = e.target.dataset.dataloggerid;
  document.getElementById("channelid02").value = e.target.dataset.channelid;  
  document.getElementById("userid02").value = e.target.dataset.userid;
  document.getElementById("table02").value = e.target.dataset.table;
  document.getElementById("column02").value = e.target.dataset.column;
  document.getElementById("state02").value = true;
  
}

//acciones de los botones en cada tarjeta individual
$d.addEventListener('click', (e) => {    
    let accion = null;
    let id = null;
    let contacto = null;

         
        if (e.target.id == 'eliminarUsuario'){
            let dni = e.target.dataset.dni;
            let nombre = e.target.dataset.nombre_1;
            let apellido = e.target.dataset.apellido_1;
            console.log(`eliminando al usuario con dni: ${dni}`);
            eliminarUsuario(dni, nombre, apellido)
        }       
        
        //eliminarUbicacion
        if (e.target.id == 'eliminarUbicacion'){
            let id = e.target.dataset.id;
            let nombre = e.target.dataset.nombre;
            
            console.log(`eliminando la ubicacion con id: ${id}`);
            eliminarUbicacion(id, nombre);
        } 

        //eliminarDatalogger
        if (e.target.id == 'eliminarDatalogger'){
            let id = e.target.dataset.id;
            let nombre = e.target.dataset.nombre;
            
            console.log(`eliminando el datalogger con id: ${id}`);
            eliminarDatalogger(id, nombre);
        } 

        //desasociar_datalogger
        if (e.target.id == 'desasociar_datalogger'){
            let idDataloggerUbicacion = e.target.dataset.id_datalogger_ubicacion;
            let idDatalogger = e.target.dataset.id_datalogger;
            let nombredatalogger = e.target.dataset.nombre_datalogger;
            let nombreUbicacion = e.target.dataset.nombre_ubicacion;
            let idUbicacion = e.target.dataset.id_ubicacion;
            
            
            console.log(`Desasociando el datalogger ${nombredatalogger} de la ubicación ${nombreUbicacion} con id: ${idDataloggerUbicacion}`);
            desasociarDatalogger(idDataloggerUbicacion, nombredatalogger, nombreUbicacion, idUbicacion);
        } 

});
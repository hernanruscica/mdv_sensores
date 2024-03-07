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
        title: 'Eliminar datalogger.',
        text: `Confirma la eliminación del datalogger ${nombre} ? Esta acción no se puede deshacer`,
        icon: 'warning',                   
        showDenyButton: true,                               
        confirmButtonText: 'Eliminar',
        confirmButtonColor: '#FF0000',
        denyButtonText: 'Conservar',
        denyButtonColor: '#28DC25'

    }).then((result) => {
         if (result.value) {            
             fetch(`/dataloggers/delete/${id}`, { method: 'DELETE' })
             .then(response => {
                 // manejar respuesta exitosa    
                 Swal.fire({
                     title: 'Datalogger eliminado !',
                     text: `Se eliminó el datalogger ${nombre} con exito.`,
                     icon: 'info',
                     confirmButtonText: 'Entendido'
                 }).then((result) => { 
                     if (result.value){
        //                 //location.reload();    
                         window.location.href = '/dataloggers/all' ;    
                     }
                 }); 
             })
             .catch(error => {
                 // manejar error
         console.log("error al borrar el elemento", error);
     });
 }
        window.location.href = '/dataloggers/all' ;
    })            
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
            let idDatalogger = e.target.dataset.id_datalogger;
            let nombredatalogger = e.target.dataset.nombre_datalogger;
            let nombreUbicacion = e.target.dataset.nombre_ubicacion;
            let idUbicacion = e.target.dataset.id_ubicacion;
            
            console.log(`Desasociando el datalogger ${nombredatalogger} con id ${idDatalogger}\nde la ubicación ${nombreUbicacion} con id: ${idUbicacion}`);
            //eliminarDatalogger(id, nombre);
        } 

});
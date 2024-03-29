// Script para abrir el modal de nueva asociacion -->
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("agregarDataloggerBtn").addEventListener('click', function (e) {
        var myModal = new bootstrap.Modal(document.getElementById('agregarDataloggerModal'));
      
        let $desasociarBtn = document.getElementById("desasociar_datalogger");
        // Acceder a los atributos personalizados del botón que desencadenó el evento de clic 
        const idUsuario = document.getElementById("usuario_id").value;
        const idDatalogger = $desasociarBtn.getAttribute('data-id_datalogger');      
        const nombreUbicacion = $desasociarBtn.getAttribute('data-nombre_ubicacion'); 
        const nombreDatalogger = $desasociarBtn.getAttribute('data-nombre_datalogger');        
        const idUbicacion = $desasociarBtn.getAttribute('data-id_ubicacion');
      
        console.log(idUsuario, idDatalogger, nombreUbicacion, nombreDatalogger, idUbicacion);      
        myModal.show();
      
        document.getElementById("usuario_id").value = idUsuario;
    });    
}); 
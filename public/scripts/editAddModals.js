//Funciones para cargar los datos en los modales ocultos inicialmente.
document.addEventListener('DOMContentLoaded', function () {
    var myModal = new bootstrap.Modal(document.getElementById('agregarRolesModal'));
    document.getElementById('agregarRolesBtn').addEventListener('click', function () {
      myModal.show();
    });
    var myModal2 = new bootstrap.Modal(document.getElementById('editarRolesModal'));
    document.querySelectorAll('#editarRolesBtn').forEach(button => {
      button.addEventListener('click', function (e) {
      // Extraemos los datos personalizados del botón "Editar"
      const idUsuario = button.getAttribute('data-id_usuario');
      const idUbicacion = button.getAttribute('data-id_ubicacion');
      const idRol = button.getAttribute('data-id_rol');
      const nombreUbicacion = button.getAttribute('data-nombre_ubicacion');
      const nombreRol = button.getAttribute('data-nombre_rol');
      const idUsuariosXubicacionesXroles = button.getAttribute('data-usuarios_x_ubicaciones_x_roles_id');            
      console.log(idUsuario, idUbicacion, idRol, nombreUbicacion, nombreRol, idUsuariosXubicacionesXroles);      
      myModal2.show();
      
      document.getElementById("usuarios_id").value = idUsuario;
      document.getElementById("usuarios_x_ubicaciones_x_roles_id_edit").value = idUsuariosXubicacionesXroles;

      const ubicacionesSelect = document.getElementById("ubicaciones_id_edit");
      ubicacionesSelect.value = idUbicacion;
      const rolesSelect = document.getElementById("roles_id_edit");
      rolesSelect.value = idRol;
    });
  });

});
//Permite cargar una imagen del disco y mostrarla como vista previa
document.getElementById('image').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var imgPreview = document.getElementById('imagePreview');

    // Verifica si se seleccionó una imagen
    if (file) {
        var reader = new FileReader();

        // Cuando se cargue el archivo, muestra la vista previa de la imagen
        reader.onload = function(e) {
            imgPreview.src = e.target.result;
            imgPreview.style.display = 'block';
        };

        // Lee el archivo como una URL de datos
        reader.readAsDataURL(file);
    } else {
        // Si no se seleccionó ninguna imagen, oculta la vista previa
        imgPreview.src = '';
        imgPreview.style.display = 'none';
    }
});
<?php
// Verifica si se ha recibido una solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Accede a los datos adicionales
    $nombre = $_POST['nombre'];
    $edad = $_POST['edad'];
    
    // Accede a la información de la imagen
    $uploadedFile = $_FILES['image'];

    // Verifica si la imagen se cargó correctamente
    if ($uploadedFile['error'] === UPLOAD_ERR_OK) {
        // Ruta de destino en el servidor PHP
        $destination = 'uploads/' . $uploadedFile['name'];

        // Mueve el archivo de la ubicación temporal a la ubicación deseada
        if (move_uploaded_file($uploadedFile['tmp_name'], $destination)) {
            echo 'Imagen y datos recibidos y guardados correctamente en el servidor PHP.';
        } else {
            echo 'Error al mover la imagen al destino en el servidor PHP.';
        }
    } else {
        echo 'Error al recibir la imagen en el servidor PHP.';
    }
} else {
    // Si no es una solicitud POST, devolver un mensaje de error
    echo 'Error: Se esperaba una solicitud POST.';
}
?>

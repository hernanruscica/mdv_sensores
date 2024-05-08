
<?php

include_once('./credenciales_mysql.php');

//Version mejorada del codigo originalmente subido a mdvsrl para recepcion de los datos.

// Inicializo todo en cero para canales digitales, analógicos y extras
$identificador = $tiempo_total = $d_date = 0;
$dChannels = $aChannels = $extraChannels = [];

// Cargo las variables con los valores POST
$identificador = $_POST['identificador'];
$tiempo_total  = $_POST['tiempo_total'];
$texto = $_POST['texto'];

// Limpio y preparo los datos para canales digitales
for ($i = 1; $i <= 8; $i++) {
    $dChannels["d{$i}_estado"]   = $_POST["d{$i}_estado"];
    $dChannels["d{$i}_cantidad"] = $_POST["d{$i}_cantidad"];
    $dChannels["d{$i}_tiempo"]   = $_POST["d{$i}_tiempo"];
}

// Limpio y preparo los datos para canales analógicos
for ($i = 1; $i <= 5; $i++) {
    $aChannels["a{$i}_inst"]     = $_POST["a{$i}_inst"];
    $aChannels["a{$i}_min"]      = $_POST["a{$i}_min"];
    $aChannels["a{$i}_max"]      = $_POST["a{$i}_max"];
    $aChannels["a{$i}_estado"]   = $_POST["a{$i}_estado"];
    $aChannels["a{$i}_cantidad"] = $_POST["a{$i}_cantidad"];
    $aChannels["a{$i}_tiempo"]   = $_POST["a{$i}_tiempo"];
}

// Limpio y preparo los datos para canales extras
$extraChannels = [
    'servicio' => intval($_POST['servicio']),
    'energia'  => intval($_POST['energia'])    
];

date_default_timezone_set('America/Argentina/Buenos_Aires');
$d_date = date('Y-m-d H:i:s', time());

// Apertura de la base de datos
$conexion = mysqli_connect($servidorSQL, $usuario, $password, $base_datos);

if (!$conexion) {
    die("Error de conexión: " . mysqli_connect_error());
}

mysqli_select_db($conexion, $base_datos);
mysqli_query($conexion, "SET NAMES 'utf8'");

// Construyo la consulta preparada
$columns = implode(',', array_keys($dChannels + $aChannels + $extraChannels));
$values  = implode(',', array_fill(0, count($dChannels + $aChannels + $extraChannels), '?'));

$query = "INSERT INTO $tabla (`indice`,`fecha`,`identificador`,`tiempo_total`, `texto`, $columns)
          VALUES (NULL, ?, ?, ?, ?, $values)";
//print($query);

// Preparo la consulta
$stmt = mysqli_prepare($conexion, $query);

//print('ddd');
// Creo un array con tipos de datos según el número de variables
$typeArray = 'ssss' . str_repeat('i', count($dChannels) + count($aChannels) + count($extraChannels)); // s: string, i: integer

// Enlazo los parámetros
mysqli_stmt_bind_param(
    $stmt,
    $typeArray,
    $d_date, $identificador, $tiempo_total, $texto,
    ...array_values($dChannels),
    ...array_values($aChannels),
    ...array_values($extraChannels)
);

// Ejecuto la consulta
mysqli_stmt_execute($stmt);

// Verifico si la consulta fue exitosa
if (mysqli_stmt_affected_rows($stmt) > 0) {
    echo "datos recibidos<br>";
} else {
    echo "Error al insertar los datos.";
}

// Cierro la conexión y la consulta preparada
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>

USE mdvsrl;
SHOW TABLES;
SHOW columns from usuarios;

SELECT * FROM `mdvsrl`.`usuarios`;
SELECT * FROM `mdvsrl`.`usuarios` WHERE `dni` = 28470300;

SELECT * FROM `mdvsrl`.`direcciones`;

SELECT `nombre_1`, `apellido_1`, `dni`, `password`, `foto`, `email`, `telefono`, `estado`, `direcciones`.`calle`, `direcciones`.`numero`, `direcciones`.`localidad` 
FROM `usuarios` 
INNER JOIN `direcciones` ON  `usuarios`.`direcciones_id` = `direcciones`.`id` 
WHERE `dni` = 99777555;


SELECT * FROM `mdvsrl`.`usuarios`; /*tengo el id para usarlo en */
SELECT * FROM `usuarios_x_ubicaciones_x_roles`;
SELECT * FROM `roles`;
SELECT * FROM `ubicaciones`;
SELECT * FROM `ubicaciones` WHERE `id` = 8;



SELECT `ubicaciones`.`nombre`, `ubicaciones`.`descripcion`, `ubicaciones`.`foto`, `ubicaciones`.`telefono`,
		`usuarios_x_ubicaciones_x_roles`.`usuarios_id` AS usuarios_id, `usuarios_x_ubicaciones_x_roles`.`roles_id` AS roles_id,
        `roles`.`nombre` AS nombre_rol
FROM `ubicaciones`
INNER JOIN `usuarios_x_ubicaciones_x_roles` ON `ubicaciones`.`id` = `usuarios_x_ubicaciones_x_roles`.`ubicaciones_id` 
INNER JOIN `roles` ON roles_id = `roles`.`id`
WHERE usuarios_id = 3;


ALTER TABLE `mdvsrl`.`direcciones`
ADD COLUMN `provincia` VARCHAR(45) NOT NULL AFTER `partido`;

/*`direcciones_id` INT UNSIGNED NOT NULL,*/

ALTER TABLE `mdvsrl`.`usuarios`
MODIFY  COLUMN `direcciones_id` INT UNSIGNED NULL;

ALTER TABLE `mdvsrl`.`usuarios`
DROP PRIMARY KEY,
ADD UNIQUE INDEX `unique_direcciones_id` (`direcciones_id` ASC);

ALTER TABLE `usuarios`
MODIFY COLUMN `direcciones_id` INT UNSIGNED NOT NULL DEFAULT 0;

UPDATE  `usuarios`
SET `direcciones_id` = 0
WHERE `id` >= 26;


SELECT * FROM `mdvsrl`.`direcciones`;
SELECT * FROM `mdvsrl`.`dataloggers`;
SELECT * FROM `mdvsrl`.`ubicaciones`;
SELECT * FROM `mdvsrl`.`dataloggers_x_ubicacion`;

SELECT mdvsrl.dataloggers_x_ubicacion.datalogger_id 
FROM mdvsrl.dataloggers_x_ubicacion
INNER JOIN mdvsrl.ubicaciones ON  mdvsrl.dataloggers_x_ubicacion.ubicaciones_id = mdvsrl.ubicaciones.id
WHERE mdvsrl.ubicaciones.id = 5;

SELECT direccion_mac, nombre, descripcion, foto
FROM mdvsrl.dataloggers
WHERE id  = 3;


use mdvsrldatos;
show tables;

drop table trama2022;

/*
identificador  tabla
84CCA87AB934   guemes (tiene a1)
83AF27C42B8     test  (tiene a1)
no tiene 		iriarte
*/
select * from guemes order by fecha desc limit 100; 
select fecha, a1_inst, a1_min, a1_max, a1_cantidad, a1_tiempo from guemes where fecha >= '2023-12-28' and fecha <= '2023-12-29' order by fecha desc;
select fecha, a1_inst, a1_min, a1_max, a1_cantidad, a1_tiempo from guemes where fecha >= CURDATE() - INTERVAL 1 DAY AND fecha < CURDATE() + INTERVAL 1 DAY order by fecha desc;


use mdvsrl;
show tables;

select * from dataloggers;
select * from dataloggers where id = 1;

select * from canales;

insert into canales
(id, datalogger_id, nombre, descripcion, nombre_columna, multiplicador, fecha_creacion)
values
(4, 2, 'Cantidad de encendidos', 'Mide la cantidad de encendidos de la heladera patrick', 'd1', 1, '2024-01-04');

select dataloggers.nombre , dataloggers.descripcion, direccion_mac, foto, nombre_tabla, fecha_creacion
from dataloggers
where dataloggers.id = 1;

select canales.nombre_columna, canales.nombre as canal_nombre, canales.descripcion as canal_descripcion
from canales
where datalogger_id = 2;


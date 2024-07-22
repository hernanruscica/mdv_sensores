USE mdvsrl;
SHOW TABLES;
SHOW columns from usuarios;

SELECT * FROM `mdvsrl`.`usuarios`;
SELECT * FROM `mdvsrl`.`usuarios` WHERE `dni` = 28470300;

SELECT * FROM `mdvsrl`.`direcciones`;

update direcciones 
set
	calle = "calle falsa",
    numero = 123
where
	id = 1;
    

SELECT `nombre_1`, `apellido_1`, `dni`, `password`, `foto`, `email`, `telefono`, `estado`, `direcciones`.`calle`, `direcciones`.`numero`, `direcciones`.`localidad` 
FROM `usuarios` 
INNER JOIN `direcciones` ON  `usuarios`.`direcciones_id` = `direcciones`.`id` 
WHERE `dni` = 99777555;


SELECT * FROM `mdvsrl`.`usuarios`; /*tengo el id para usarlo en */
SELECT * FROM `usuarios_x_ubicaciones_x_roles`;
SELECT * FROM `roles`;
SELECT * FROM `ubicaciones`;
SELECT * FROM `direciones`;
SELECT * FROM `ubicaciones` WHERE `id` = 8;
SELECT * FROM `dataloggers`;
SELECT * FROM `dataloggers_x_ubicacion`;




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

update usuarios
set foto = 'default_avatar.png';


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


select nombre , descripcion, direccion_mac, foto, nombre_tabla, fecha_creacion
from dataloggers
where dataloggers.id = 2;

select canales.nombre_columna, canales.nombre as canal_nombre, canales.descripcion as canal_descripcion
from canales
where datalogger_id = 2;

select * from usuarios;
select * from roles;
select * from usuarios_x_ubicaciones_x_roles;


select * from usuarios_x_ubicaciones_x_roles where usuarios_id = 85;
select * from dataloggers_x_ubicacion;
delete from usuarios_x_ubicaciones_x_roles where id = 59;

/*ya tengo los datos principales del usuario, con esta consulta obtengo los permisos que tiene sobre ubicaciones*/
select  ubicaciones.id as ubicacion_id, ubicaciones.nombre as ubicacion_nombre, usuarios_x_ubicaciones_x_roles.roles_id as rol_id
FROM usuarios_x_ubicaciones_x_roles 
INNER JOIN ubicaciones ON  usuarios_x_ubicaciones_x_roles.ubicaciones_id = ubicaciones.id
where usuarios_x_ubicaciones_x_roles.usuarios_id = 32;

/*obtengo los usuarios asignados a una ubicacion*/
select *
from usuarios_x_ubicaciones_x_roles
inner join ubicaciones on usuarios_x_ubicaciones_x_roles.ubicaciones_id = ubicaciones.id
where ubicaciones_id = 2;

insert into usuarios_x_ubicaciones_x_roles
(usuarios_id, ubicaciones_id, roles_id, fecha_creacion)
values
(32, 3, 7, curdate());

delete from usuarios_x_ubicaciones_x_roles
where id = 15;

select * from usuarios_x_ubicaciones_x_roles;

select * from dataloggers;
select * from dataloggers_x_ubicacion;

#selecciona id, direccion_mac, nombre, descripcion, foto, nombre_tabla, fecha_creacion de datalogger
#de una determinada ubicacion
select dataloggers.* 
from dataloggers
inner join dataloggers_x_ubicacion on dataloggers.id = dataloggers_x_ubicacion.datalogger_id
where dataloggers_x_ubicacion.ubicaciones_id = 2;

select * 
from dataloggers
inner join dataloggers_x_ubicacion on dataloggers.id = dataloggers_x_ubicacion.datalogger_id;

select ubicaciones_id from dataloggers_x_ubicacion where datalogger_id = 1;

select *
from dataloggers_x_ubicacion
inner join dataloggers on dataloggers_x_ubicacion.dataloggers_id = dataloggers.id
where dataloggers_x_ubicacion.ubicaciones_id = (select ubicaciones_id from dataloggers_x_ubicacion where datalogger_id = 1);

delete from dataloggers_x_ubicacion
where id = 1 ;

insert into dataloggers_x_ubicacion
(ubicaciones_id, datalogger_id, fecha_creacion)
values
(40, 8, CURRENT_TIMESTAMP());


SELECT * FROM `usuarios_x_ubicaciones_x_roles`;

#revisa si ya existe un usuario_id con esa ubicacion_id
SELECT EXISTS (
    SELECT 1
    FROM usuarios_x_ubicaciones_x_roles
    WHERE usuarios_id = 32
    AND ubicaciones_id = 2
) AS existe_relacion;

#Agrega un nuevo registro
insert into usuarios_x_ubicaciones_x_roles
(usuarios_id, ubicaciones_id, roles_id, fecha_creacion)
values
(32, 3, 9, curdate());

ALTER TABLE `ubicaciones`
ADD COLUMN `email` VARCHAR(45) NULL AFTER `telefono`;

UPDATE `ubicaciones`
SET `email` = 'info@ruscica-code.ar';

ALTER TABLE usuarios
ADD COLUMN espropietario BOOLEAN AFTER estado;

UPDATE usuarios
SET espropietario = CASE 
                        WHEN dni = 28470359 THEN true
                        ELSE false
                    END;

insert into dataloggers
(direccion_mac, nombre, descripcion, foto, nombre_tabla, fecha_creacion)
values
('23:45:67:89:AB:CD', 'node03Grido', 'insertado con mysql workbench', 'fotodatalogger.png', 'guemes', CURRENT_TIMESTAMP());

SELECT * FROM `dataloggers_x_ubicacion`;
select * from ubicaciones;
select * from dataloggers;

INSERT INTO `dataloggers_x_ubicacion`
	(ubicaciones_id, datalogger_id, fecha_creacion)
VALUES
	('36', '1', CURRENT_TIMESTAMP());
    
/*Trabajando con los canales por cada datalogger*/    
use mdvsrl;
show tables;
select * from mdvsrl.dataloggers;
select * from mdvsrl.canales;
select *  from mdvsrl.canales where id = 1;

insert into mdvsrl.canales
    (datalogger_id, nombre, descripcion, nombre_columna, multiplicador, fecha_creacion)
values
	(3, 'Termistor 2', 'Mide la temperatura en la ultima hora y ultimas 24 Hs.', 'a2', 0.04968, current_date());
	
delete from mdvsrl.canales where datalogger_id = 2;

delete from mdvsrl.canales where id = 2;

update mdvsrl.canales 
	set 
		/*nombre = 'Cafetera',*/
		descripcion = 'Mide la temperatura en la ultima hora y ultimas 24 Hs. Con multiplicador = 0.054',		
		nombre_columna = 'a2',
        multiplicador = 0.054
    where id = 15;
    
update mdvsrl.dataloggers 
	set 
		direccion_mac = '25:D8:7S:A6:77:D4',
		nombre = 'Tercer NodeMCU',
		descripcion = 'Dispositivo de recoleccion de datos instalado en el Guemes.',	
        foto = '1709577022398-jpeg',
		nombre_tabla = 'guemes',
        fecha_creacion = current_timestamp()
    where id = 3;

select * from mdvsrl.alarmas where estado = 1;
select * from usuarios;
select * from alarmas;
select * from mdvsrl.alarmas_x_usuarios;
select * from mdvsrl.alarmas_x_usuarios where alarma_id = 47;

insert into mdvsrl.alarmas_x_usuarios
	(alarma_id, usuario_id, fecha_creacion)
values
	(47, 84, current_timestamp());

delete from mdvsrl.alarmas_x_usuarios where id >= 36;

select mdvsrl.usuarios.email 
from mdvsrl.alarmas_x_usuarios 
inner join mdvsrl.usuarios on mdvsrl.usuarios.id = mdvsrl.alarmas_x_usuarios.usuario_id
where alarma_id = 1;

delete from mdvsrl.alarmas_x_usuarios where usuario_id = 7;

truncate table mdvsrl.alarmas_x_usuarios;/*elimina todos los registros, deja la tabla, pero vuelve a cero el indice*/

delete from mdvsrl.alarmas 
where id != 1 AND id != 10 AND id != 25; 

update mdvsrl.alarmas
	set 
		canal_id = 10,
        tabla = 'guemes',
        columna= 'd2',
        nombre = 'Guemes compresor 2 - Encendidos - Ult. Hora - Max = 50%',
		descripcion = 'Se activa si se sobrepasa 50% de tiempo de encendido',
		max = 50,
        min = 0,
        periodo_tiempo = '1 HOUR',
        estado= true
	where id = 1;

update mdvsrl.alarmas
	set 		
        estado= true
	where id = 47;
    
select * from `mdvsrl`.`alarmas_logs`;
select * from `mdvsrl`.`alarmas_logs` where usuario_id = 32;
select * from `mdvsrl`.`alarmas_logs` where canal_id = 10 ORDER BY fecha_disparo desc;
select * from alarmas where canal_id = 10;

select `alarmas_logs`.*, `usuarios`.nombre_1, `usuarios`.apellido_1, `usuarios`.email  
from `alarmas_logs` 
INNER JOIN `usuarios` 
ON `alarmas_logs`.usuario_id = `usuarios`.id 
where canal_id = 10 
ORDER BY fecha_disparo desc;

select alarmas.*, canales.datalogger_id, canales.nombre as canal_nombre, canales.descripcion as canal_descripcion 
from alarmas
INNER JOIN canales
ON alarmas.canal_id = canales.id
where alarmas.id = 1
ORDER BY fecha_creacion DESC;

select * from canales where datalogger_id = 3;


update canales
set tiempo_a_promediar = '12 HOUR'
where id = 13;
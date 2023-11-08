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

ALTER TABLE direcciones ADD provincia VARCHAR(255) DEFAULT "0";

SELECT * FROM `mdvsrl`.`direcciones`;

START TRANSACTION;
-- Primero, actualiza la tabla 'usuarios'
UPDATE `mdvsrl`.`usuarios`
SET
  `nombre_1` = 'Nuevo nombre',
  `nombre_2` = 'Nuevo segundo nombre',
  `apellido_1` = 'Nuevo apellido',
  `apellido_2` = 'Nuevo segundo apellido',  
  `email` = 'nuevo_email@example.com',  
  `telefono` = '1234567890'
WHERE
  `usuarios`.`dni` = 22232312
; 

-- Luego, actualiza la tabla 'direcciones'
UPDATE `mdvsrl`.`direcciones`
SET
  `calle` = 'Nueva calle',
  `numero` = 123,
  `localidad` = 'Nueva localidad',
  `partido` = 'Nuevo partido',
  `provincia` = 'Nueva provincia'    
WHERE
  `direcciones`.`id` = 1; 

-- Si llega hasta este punto sin errores, confirma la transacción
COMMIT;

-- Si ocurre algún error, deshace la transacción
ROLLBACK;

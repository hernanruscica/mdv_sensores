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
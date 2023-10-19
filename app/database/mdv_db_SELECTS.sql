USE grupo97ispc;
SHOW TABLES;
SHOW columns from usuarios;

SELECT * FROM `grupo97ispc`.`usuarios`;
SELECT * FROM `grupo97ispc`.`usuarios` WHERE `dni` = 28470300;
SELECT * FROM `grupo97ispc`.`usuarios` WHERE `dni` = 28470360;

SELECT * FROM `grupo97ispc`.`direcciones`;

SELECT `nombre_1`, `apellido_1`, `dni`, `password` `foto`, `email`, `telefono`, `estado`, `direcciones`.`calle`, `direcciones`.`numero`, `direcciones`.`localidad` 
FROM `usuarios` 
INNER JOIN `direcciones` ON  `usuarios`.`direcciones_id` = `direcciones`.`id` ;


ALTER TABLE `grupo97ispc`.`direcciones`
ADD COLUMN `provincia` VARCHAR(45) NOT NULL AFTER `partido`;

/*`direcciones_id` INT UNSIGNED NOT NULL,*/

ALTER TABLE `grupo97ispc`.`usuarios`
MODIFY  COLUMN `direcciones_id` INT UNSIGNED NULL;

ALTER TABLE `grupo97ispc`.`usuarios`
MODIFY COLUMN `direcciones_id` INT UNSIGNED NULL;

ALTER TABLE `grupo97ispc`.`usuarios`
DROP PRIMARY KEY,
ADD UNIQUE INDEX `unique_direcciones_id` (`direcciones_id` ASC);



SELECT * FROM `grupo97ispc`.`direcciones`;
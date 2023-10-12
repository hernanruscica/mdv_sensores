USE grupo97ispc;
SHOW TABLES;

SELECT * FROM `grupo97ispc`.`usuarios`;
SELECT * FROM `grupo97ispc`.`usuarios` WHERE `dni` = 28470300;
SELECT * FROM `grupo97ispc`.`usuarios` WHERE `dni` = 28470300;

ALTER TABLE `grupo97ispc`.`direcciones`
ADD COLUMN `provincia` VARCHAR(45) NOT NULL AFTER `partido`;

/*`direcciones_id` INT UNSIGNED NOT NULL,*/

ALTER TABLE `grupo97ispc`.`direcciones`
MODIFY  COLUMN `direcciones_id` INT UNSIGNED NULL;

SELECT * FROM `grupo97ispc`.`direcciones`;
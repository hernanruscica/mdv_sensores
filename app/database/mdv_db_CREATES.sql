use mdvsrl;
show tables;

-- -----------------------------------------------------
-- Table `mdvsrl`.`direcciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mdvsrl`.`direcciones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `calle` VARCHAR(45) NOT NULL,
  `numero` INT NOT NULL,
  `localidad` VARCHAR(45) NOT NULL,
  `partido` VARCHAR(45) NOT NULL,
  `provincia` VARCHAR(45) NOT NULL,
  `codigo_postal` VARCHAR(45) NULL,
  `latitud` VARCHAR(45) NULL,
  `longitud` VARCHAR(45) NULL,  
  `fecha_creacion` DATE NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `mdvsrl`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mdvsrl`.`usuarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre_1` VARCHAR(45) NOT NULL,
  `nombre_2` VARCHAR(45) NULL,
  `apellido_1` VARCHAR(45) NOT NULL,
  `apellido_2` VARCHAR(45) NULL,
  `dni`INT UNSIGNED NOT NULL,
  `foto` VARCHAR(45) NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
  `estado` INT NOT NULL,
  `fecha_creacion` DATE NULL,
  `direcciones_id` INT UNSIGNED  NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`, `direcciones_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  UNIQUE INDEX `dni_UNIQUE` (`dni` ASC) ,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) ,
  INDEX `fk_usuarios_direcciones1_idx` (`direcciones_id` ASC) ,
  CONSTRAINT `fk_usuarios_direcciones1`
    FOREIGN KEY (`direcciones_id`)
    REFERENCES `grupo97ispc`.`direcciones` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `mdvsrl`.`ubicaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mdvsrl`.`ubicaciones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `telefono` VARCHAR(45) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(100) NULL,
  `foto` VARCHAR(45) NULL,
  `direcciones_id` INT UNSIGNED NOT NULL,
  `fecha_creacion` DATE NULL,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  PRIMARY KEY (`id`, `direcciones_id`),
  INDEX `fk_ubicaciones_direcciones1_idx` (`direcciones_id` ASC) ,
  CONSTRAINT `fk_ubicaciones_direcciones1`
    FOREIGN KEY (`direcciones_id`)
    REFERENCES `grupo97ispc`.`direcciones` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `mdvsrl`.`acciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mdvsrl`.`acciones` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(100) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `mdvsrl`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mdvsrl`.`roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(45) NULL,
  `accion_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`, `accion_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_roles_accion1_idx` (`accion_id` ASC) ,
  CONSTRAINT `fk_roles_accion1`
    FOREIGN KEY (`accion_id`)
    REFERENCES `grupo97ispc`.`acciones` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `mdvsrl`.`usuarios_x_ubicaciones_x_roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mdvsrl`.`usuarios_x_ubicaciones_x_roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuarios_id` INT UNSIGNED NOT NULL,
  `ubicaciones_id` INT UNSIGNED NOT NULL,
  `roles_id` INT UNSIGNED NOT NULL,
  `fecha_creacion` DATE NULL,
  PRIMARY KEY (`id`, `usuarios_id`, `ubicaciones_id`, `roles_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_usuarios_x_ubicaciones_usuarios1_idx` (`usuarios_id` ASC) ,
  INDEX `fk_usuarios_x_ubicaciones_ubicaciones1_idx` (`ubicaciones_id` ASC) ,
  INDEX `fk_usuarios_x_ubicaciones_roles1_idx` (`roles_id` ASC) ,
  CONSTRAINT `fk_usuarios_x_ubicaciones_usuarios1`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `grupo97ispc`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_usuarios_x_ubicaciones_ubicaciones1`
    FOREIGN KEY (`ubicaciones_id`)
    REFERENCES `grupo97ispc`.`ubicaciones` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_usuarios_x_ubicaciones_roles1`
    FOREIGN KEY (`roles_id`)
    REFERENCES `grupo97ispc`.`roles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `mdvsrl`.`dataloggers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mdvsrl`.`dataloggers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `direccion_mac` VARCHAR(45) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(100) NULL,
  `foto` VARCHAR(45) NULL,
  `entrada01_id` INT NULL,
  `entrada01_nombre` VARCHAR(45) NULL,
  `entrada01_descripcion` VARCHAR(100) NULL,
  `entrada02_id` INT NULL,
  `entrada02_nombre` VARCHAR(45) NULL,
  `entrada02_descripcion` VARCHAR(100) NULL,
  `entrada03_id` INT NULL,
  `entrada03_nombre` VARCHAR(45) NULL,
  `entrada03_descripcion` VARCHAR(100) NULL,
  `entrada04_id` INT NULL,
  `entrada04_nombre` VARCHAR(45) NULL,
  `entrada04_descripcion` VARCHAR(100) NULL,
  `entrada05_id` INT NULL,
  `entrada05_nombre` VARCHAR(45) NULL,
  `entrada05_descripcion` VARCHAR(100) NULL,
  `entrada06_id` INT NULL,
  `entrada06_nombre` VARCHAR(45) NULL,
  `entrada06_descripcion` VARCHAR(100) NULL,
  `fecha_creacion` DATE NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `mdvsrl`.`dataloggers_x_ubicacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mdvsrl`.`dataloggers_x_ubicacion` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ubicaciones_id` INT UNSIGNED NOT NULL,
  `datalogger_id` INT UNSIGNED NOT NULL,
  `fecha_creacion` DATE NULL,
  PRIMARY KEY (`id`, `ubicaciones_id`, `datalogger_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_dataloggers_x_ubicacion_ubicaciones1_idx` (`ubicaciones_id` ASC) ,
  INDEX `fk_dataloggers_x_ubicacion_datalogger1_idx` (`datalogger_id` ASC) ,
  CONSTRAINT `fk_dataloggers_x_ubicacion_ubicaciones1`
    FOREIGN KEY (`ubicaciones_id`)
    REFERENCES `mdvsrl`.`ubicaciones` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_dataloggers_x_ubicacion_datalogger1`
    FOREIGN KEY (`datalogger_id`)
    REFERENCES `mdvsrl`.`dataloggers` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `mdvsrl`.`alarmas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mdvsrl`.`alarmas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,  
  `canal_id` INT UNSIGNED NOT NULL,
  `tabla` VARCHAR(45) NOT NULL,
  `columna` VARCHAR(45) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(200) NULL,
  `max` FLOAT NULL,
  `min` FLOAT NULL,  
  `periodo_tiempo` VARCHAR(45) NOT NULL,
  `estado` BOOLEAN,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`, `canal_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_alarmas_canal1_idx` (`canal_id` ASC),
  CONSTRAINT `fk_alarmas_canal1`
    FOREIGN KEY (`canal_id`)
    REFERENCES `mdvsrl`.`canales` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `mdvsrl`.`alarmas_x_usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mdvsrl`.`alarmas_x_usuarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `alarma_id` INT UNSIGNED NOT NULL,
  `usuario_id` INT UNSIGNED NOT NULL,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`, `alarma_id`, `usuario_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_alarmas_x_usuarios_alarmas1_idx` (`alarma_id` ASC) ,
  INDEX `fk_alarmas_x_usuarios_usuarios1_idx` (`usuario_id` ASC) ,
  CONSTRAINT `fk_alarmas_x_usuarios_alarmas1`
    FOREIGN KEY (`alarma_id`)
    REFERENCES `mdvsrl`.`alarmas` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_alarmas_x_usuarios_usuarios1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `mdvsrl`.`usuarios` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `mdvsrl`.`alarmas_logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mdvsrl`.`alarmas_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `alarma_id` INT UNSIGNED NOT NULL,
  `usuario_id` INT UNSIGNED NOT NULL,
  `canal_id` INT UNSIGNED NOT NULL,
  `fecha_disparo` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_vista` DATETIME NULL,
  PRIMARY KEY (`id`, `alarma_id`, `usuario_id`, `canal_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_alarmas_logs_alarmas_idx` (`alarma_id` ASC),
  INDEX `fk_alarmas_logs_usuarios_idx` (`usuario_id` ASC),
  INDEX `fk_alarmas_logs_canales_idx` (`canal_id` ASC), 
  CONSTRAINT `fk_alarmas_logs_alarmas`
    FOREIGN KEY (`alarma_id`)
    REFERENCES `mdvsrl`.`alarmas` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_alarmas_logs_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `mdvsrl`.`usuarios` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_alarmas_logs_canales`
    FOREIGN KEY (`canal_id`)
    REFERENCES `mdvsrl`.`canales` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


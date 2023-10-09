
-- -----------------------------------------------------
-- Table `grupo97ispc`.`direcciones`
-- -----------------------------------------------------
INSERT INTO `grupo97ispc`.`direcciones` (`calle`, `numero`, `localidad`, `partido`, `codigo_postal`, `latitud`, `longitud`, `fecha_creacion`)
VALUES
('Av. Rivadavia', 1234, 'Buenos Aires', 'Capital Federal', '1000', '-34.6090', '-58.3923', NOW()),
('Calle San Martín', 567, 'La Plata', 'La Plata', '1900', '-34.9215', '-57.9545', NOW()),
('Calle Maipú', 789, 'Córdoba', 'Córdoba', '5000', '-31.4194', '-64.1811', NOW()),
('Av. Belgrano', 101, 'Rosario', 'Rosario', '2000', '-32.9468', '-60.6395', NOW()),
('Calle Mitre', 202, 'Mendoza', 'Mendoza', '5500', '-32.8902', '-68.8473', NOW()),
('Av. Sarmiento', 303, 'San Juan', 'San Juan', '5400', '-31.5375', '-68.5364', NOW()),
('Av. Libertador', 404, 'Salta', 'Salta', '4400', '-24.7913', '-65.4145', NOW()),
('Calle San Lorenzo', 505, 'Tucumán', 'San Miguel de Tucumán', '4000', '-26.8083', '-65.2176', NOW()),
('Av. Santa Fe', 606, 'Santa Fe', 'Santa Fe', '3000', '-31.6232', '-60.6909', NOW()),
('Calle 25 de Mayo', 707, 'Bahía Blanca', 'Bahía Blanca', '8000', '-38.7196', '-62.2724', NOW());



-- -----------------------------------------------------
-- Table `grupo97ispc`.`usuarios`
-- -----------------------------------------------------
INSERT INTO `grupo97ispc`.`usuarios` (`nombre_1`, `nombre_2`, `apellido_1`, `apellido_2`, `dni`, `foto`, `email`, `password`, `telefono`, `estado`, `fecha_creacion`, `direcciones_id`)
VALUES
('Lucía', 'María', 'Gómez', 'Fernández', 28470300, 'lucia.jpg', 'lucia@gmail.com', '$2y$10$VbE/ZCM3Jg7tfi/yFvHoI.XFJ1tYqfr9RiNF.F1X8NiqALs5d3OaK', '123456789', 1, NOW(), 1),
('Mateo', 'Alejandro', 'Martínez', 'López', 40159357, 'mateo.jpg', 'mateo@hotmail.com', '$2y$10$DKd5MeDwUvETMMRXZzW0weWhGDEJb2OlqOaGieHyKD.0FrtFEk6r6', '234567890', 1, NOW(), 2),
('Sofía', 'Isabel', 'Rodríguez', 'Torres', 25487964, 'sofia.jpg', 'sofia@yahoo.com', '$2y$10$ikp9RB0hqYQIjn4us33VH.89a/LLbjJKFJjMFXiFYLYgI.IvvoWR6', '345678901', 1, NOW(), 3),
('Lautaro', 'Joaquín', 'Fernández', 'Giménez', 94785129, 'lautaro.jpg', 'lautaro@gmail.com', '$2y$10$pjs0ghohgbO0PrO4cv1bI.vJcvS6xSc1ts.EMs7zq8u2UQVBV1hNm', '456789012', 1, NOW(), 4),
('Valentina', 'Camila', 'Díaz', 'Alvarez', 38741963, 'valentina.jpg', 'valentina@gmail.com', '$2y$10$MGoU8PYxE1X2V4wz4A1WLO1yCT/H6YG4ReC7T2o75iq3R.tF6mM1K', '567890123', 1, NOW(), 5),
('Thiago', 'Benjamín', 'Martínez', 'Rojas', 37849156, 'thiago.jpg', 'thiago@hotmail.com', '$2y$10$7X2hnrYyH2/r.xpT.Az/u.lMZNDkKwFTvxJdxgVEbh93iJ/BsSXFi', '678901234', 1, NOW(), 6),
('Martina', 'Renata', 'López', 'Cruz', 321476358, 'martina.jpg', 'martina@yahoo.com', '$2y$10$5kcrB0t2NTjzHOCgPwvIL.aXO/Z0m.9W24XmtOIJT/Jhfev7dsXza', '789012345', 1, NOW(), 7),
('Benicio', 'Agustín', 'Torres', 'Morales', 28597846, 'benicio.jpg', 'benicio@gmail.com', '$2y$10$lXg4RUel01Fj.Qr43IarW.ahyORZELZFA3Tn1I.DPaWx0SdhnN8v.', '890123456', 1, NOW(), 8),
('Mía', 'Emma', 'García', 'Vargas', 39787661, 'mia.jpg', 'mia@hotmail.com', '$2y$10$py.YW9qFVm86WMI/iudKm.aeGrgEj8u2CKxTikgatX2aBqBqNGrJy', '901234567', 1, NOW(), 9),
('Nicolás', 'Facundo', 'Pérez', 'Silva', 24489125, 'nicolas.jpg', 'nicolas@gmail.com', '$2y$10$MCyNw4z9yMKYR9E6RB2ps.rSYC4InKh1lOqtm3vLecpXInH5MRBJm', '012345678', 1, NOW(), 10);

SELECT * FROM `grupo97ispc`.`usuarios`;
-- -----------------------------------------------------
-- Table `grupo97ispc`.`ubicaciones`
-- -----------------------------------------------------
INSERT INTO `grupo97ispc`.`ubicaciones` (`telefono`, `nombre`, `descripcion`, `foto`, `direcciones_id`, `fecha_creacion`)
VALUES
('011-12345678', 'Restaurante Buenos Sabores', 'Comida argentina y parrilladas', 'buenos_sabores.jpg', 1, NOW()),
('0221-2345678', 'Cafetería El Porteño', 'Cafés gourmet y pastelería', 'el_porteno.jpg', 2, NOW()),
('0341-3456789', 'Librería Cervantes', 'Amplio catálogo de libros', 'cervantes.jpg', 3, NOW()),
('0264-4567890', 'Tienda de Moda La Rosaleda', 'Ropa y accesorios de diseñadores', 'la_rosaleda.jpg', 4, NOW()),
('0261-5678901', 'Centro de Arte Contemporáneo', 'Espacio dedicado a exposiciones', 'arte_contemporaneo.jpg', 5, NOW()),
('011-67890123', 'Estudio de Abogados Almagro', 'Servicios legales especializados', 'almagro_abogados.jpg', 6, NOW()),
('0223-78901234', 'Gimnasio Fitness Plus', 'Amplio gimnasio con modernos equipos', 'fitness_plus.jpg', 7, NOW()),
('0343-89012345', 'Clínica Odontológica Dentalis', 'Atención odontológica integral', 'dentalis.jpg', 8, NOW()),
('0264-90123456', 'Estudio de Arquitectura Urbania', 'Proyectos arquitectónicos innovadores', 'urbania_arquitectura.jpg', 9, NOW()),
('011-01234567', 'Instituto de Idiomas Lingua', 'Clases de inglés, francés y español', 'lingua_idiomas.jpg', 10, NOW());

SELECT * FROM `grupo97ispc`.`ubicaciones`;
-- -----------------------------------------------------
-- Table `grupo97ispc`.`acciones`
-- -----------------------------------------------------
INSERT INTO `grupo97ispc`.`acciones` (`nombre`, `descripcion`)
VALUES
('leer', 'permite leer registros de la tabla - R'),
('crear', 'permite crear y leer registros de la tabla - CR'),
('modificar', 'permite crear, leer y modificar registro de la tabla - CRU'),
('eliminar', 'permite leer registro de la tabla - CRUD');

SELECT * FROM `grupo97ispc`.`acciones`;
-- -----------------------------------------------------
-- Table `grupo97ispc`.`roles`
-- -----------------------------------------------------
INSERT INTO `grupo97ispc`.`roles` (`nombre`, `descripcion`, `accion_id`)
VALUES
('operario', 'Operario de una ubicacion', 1),
('administrador', 'Admin de una ubicacion, controla operarios', 3),
('propietario', 'Todos los permisos, sobre las demas tablas', 3);

SELECT * FROM `grupo97ispc`.`roles`;

-- -----------------------------------------------------
-- Table `grupo97ispc`.`usuarios_x_ubicaciones_x_roles`
-- -----------------------------------------------------
INSERT INTO `grupo97ispc`.`usuarios_x_ubicaciones_x_roles` (`usuarios_id`, `ubicaciones_id`, `roles_id`, `fecha_creacion`)
VALUES
(7, 1, 7, NOW()),-- Usuario Valentina en Centro de Arte Contemporáneo como operaria
(1, 1, 7, NOW()), -- Usuario Lucía en Restaurante Buenos Sabores como Operario
(2, 2, 8, NOW()), -- Usuario Mateo en Cafetería El Porteño como Administrador
(3, 3, 9, NOW()), -- Usuario Sofía en Librería Cervantes como Propietario
(4, 4, 7, NOW()), -- Usuario Lautaro en Tienda de Moda La Rosaleda como Operario
(5, 5, 8, NOW()), -- Usuario Valentina en Centro de Arte Contemporáneo como Administrador
(6, 6, 9, NOW()), -- Usuario Thiago en Estudio de Abogados Almagro como Propietario
(7, 7, 7, NOW()), -- Usuario Martina en Gimnasio Fitness Plus como Operario
(8, 8, 8, NOW()), -- Usuario Benicio en Clínica Odontológica Dentalis como Administrador
(9, 9, 9, NOW()), -- Usuario Mía en Estudio de Arquitectura Urbania como Propietario
(10, 10, 7, NOW()); -- Usuario Nicolás en Instituto de Idiomas Lingua como Operario


-- -----------------------------------------------------
-- Table `grupo97ispc`.`dataloggers`
-- -----------------------------------------------------
INSERT INTO `grupo97ispc`.`dataloggers` (`direccion_mac`, `nombre`, `descripcion`, `foto`, 
                                         `entrada01_id`, `entrada01_nombre`, `entrada01_descripcion`,
                                         `entrada02_id`, `entrada02_nombre`, `entrada02_descripcion`,
                                         `entrada03_id`, `entrada03_nombre`, `entrada03_descripcion`,
                                         `entrada04_id`, `entrada04_nombre`, `entrada04_descripcion`,
                                         `entrada05_id`, `entrada05_nombre`, `entrada05_descripcion`,
                                         `entrada06_id`, `entrada06_nombre`, `entrada06_descripcion`,
                                         `fecha_creacion`)
VALUES
('12:34:56:78:90:AB', 'NodeMCU01', 'Dispositivo de recolección de datos', 'nodemcu01.jpg',
 1, 'Tensión Fase 1', 'Medición de la tensión de la fase 1',
 2, 'Tensión Fase 2', 'Medición de la tensión de la fase 2',
 3, 'Tensión Fase 3', 'Medición de la tensión de la fase 3',
 4, 'Tiempo Motor 1', 'Tiempo de funcionamiento del motor 1',
 5, 'Tiempo Motor 2', 'Tiempo de funcionamiento del motor 2',
 6, 'Corriente Fase 1', 'Medición de la corriente de la fase 1',
 NOW()),
 ('23:45:67:89:AB:CD', 'NodeMCU02', 'Dispositivo de recolección de datos', 'nodemcu02.jpg',
 7, 'Corriente Fase 2', 'Medición de la corriente de la fase 2',
 8, 'Corriente Fase 3', 'Medición de la corriente de la fase 3',
 9, 'Temperatura', 'Medición de la temperatura ambiente',
 10, 'Presión', 'Medición de la presión atmosférica',
 11, 'Humedad', 'Medición de la humedad relativa',
 12, 'Temperatura 2', 'Medición de la temperatura del gabinete',
 NOW());

-- -----------------------------------------------------
-- Table `grupo97ispc`.`dataloggers_x_ubicacion`
-- -----------------------------------------------------
INSERT INTO `grupo97ispc`.`dataloggers_x_ubicacion` (`ubicaciones_id`, `datalogger_id`, `fecha_creacion`)
VALUES
(1, 1, NOW()), -- Datalogger 1 en Restaurante Buenos Sabores
(1, 2, NOW()), -- Datalogger 2 en Restaurante Buenos Sabores

(2, 1, NOW()), -- Datalogger 1 en Cafetería El Porteño
(2, 3, NOW()), -- Datalogger 3 en Cafetería El Porteño

(3, 2, NOW()), -- Datalogger 2 en Librería Cervantes
(3, 3, NOW()), -- Datalogger 3 en Librería Cervantes

(4, 1, NOW()), -- Datalogger 1 en Tienda de Moda La Rosaleda
(4, 2, NOW()), -- Datalogger 2 en Tienda de Moda La Rosaleda

(5, 3, NOW()), -- Datalogger 3 en Centro de Arte Contemporáneo
(5, 1, NOW()); -- Datalogger 1 en Centro de Arte Contemporáneo


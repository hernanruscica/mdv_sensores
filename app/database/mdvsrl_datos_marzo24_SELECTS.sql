
use mdvsrl_datos;
show tables;

select * from quilmes order by fecha desc;
select * from guemes order by fecha desc;
select * from cocina order by fecha desc;

update cocina
	set d3_porc_encendido = 35
where indice = 5032;
		


select indice, fecha, d3_porc_encendido from cocina order by fecha desc;

/*Para un canal digital del 15 al 16 de marzo - reemplazar la fecha hardcodeada por CURDATE()*/
SELECT fecha, d2_cantidad, d2_tiempo, d2_estado, tiempo_total, servicio, energia, texto
FROM guemes
WHERE fecha >= DATE_SUB('2024-03-16', INTERVAL 1 HOUR) AND fecha < DATE_ADD('2024-03-16', INTERVAL 1 HOUR)
ORDER BY fecha ASC
LIMIT 9000;


/*Resultado de chagpt para hacer los promedio de encendido por hora*/
SELECT 
    DATE_FORMAT(fecha, '%Y-%m-%d %H:00:00') AS fecha_hora,
    (SUM(d2_tiempo) / TIMESTAMPDIFF(SECOND, DATE_FORMAT(fecha, '%Y-%m-%d %H:00:00'), DATE_FORMAT(fecha, '%Y-%m-%d %H:59:59'))) * 100 AS porcentaje_encendido
FROM guemes
WHERE fecha >= DATE_SUB('2024-03-16', INTERVAL 1 DAY) AND fecha < DATE_ADD('2024-03-16', INTERVAL 1 DAY)
GROUP BY DATE_FORMAT(fecha, '%Y-%m-%d %H:00:00')
ORDER BY fecha_hora ASC
LIMIT 9000;




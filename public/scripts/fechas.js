function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
  
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
  
    const fechaFormateada = `${dia}/${mes}/${anio} a las ${horas}:${minutos}`;
  
    return fechaFormateada;
  }
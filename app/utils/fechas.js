module.exports = {
    obtenerFechaYHora24Horas: () => {
        const now = new Date();

        // Agrega 24 horas (86400000 milisegundos en un día)
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // Formatea la fecha y hora en dd/mm/aaaa hh:mm
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Enero es 0
        const aaaa = tomorrow.getFullYear();
        const hh = String(tomorrow.getHours()).padStart(2, '0');
        const min = String(tomorrow.getMinutes()).padStart(2, '0');

        const fechaYHora = `${dd}/${mm}/${aaaa} ${hh}:${min}`;
        
        return fechaYHora;
    }
}
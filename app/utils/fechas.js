module.exports = {
    obtenerFechaYHora24Horas: () => {
        // Obtiene la fecha y hora actual en la zona horaria local
        const now = new Date();

        // Ajusta la zona horaria a Buenos Aires (GMT-3)
        now.setHours(now.getHours() - 3);

        // Suma 24 horas (86400000 milisegundos en un día)
        now.setTime(now.getTime() + 24 * 60 * 60 * 1000);

        // Formatea la fecha y hora en dd/mm/aaaa hh:mm
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0'); // Enero es 0
        const aaaa = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');

        const fechaYHora = `${dd}/${mm}/${aaaa} ${hh}:${min}`;

        return fechaYHora;
    }
}

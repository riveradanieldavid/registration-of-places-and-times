
// FORMATEADORES

// Función para formatear la fecha
export const formatDate = (date: string) => {
    try {
        const daysOfWeek = [
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado',
            'Domingo'
        ]
        const dateObj = new Date(date)
        const dayName = daysOfWeek[dateObj.getDay()]
        const day = dateObj.getUTCDate()
        const month = dateObj.getUTCMonth() + 1
        const year = dateObj.getUTCFullYear()
        // Capitalizar el primer carácter del nombre del día
        const capitalizedDayName =
            dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase()
        // Función para formatear la fecha?
        const formattedDate = `${capitalizedDayName} ${day
            .toString()
            .padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
        return formattedDate
    } catch (error) {
        console.error('Error en formatDate:', error)
        return date // Devolver la fecha original en caso de error
    }
}

// Función para formatear la hora
export const formatTime = (time: string) => {
    return time
}
export const revertTimeFormat = (formattedTime: string) => {
    return formattedTime
}

// Función para revertir el formato de la hora
export const revertDateFormat = (formattedDate: string) => {
    const [, dayMonthYear] = formattedDate.split(' ')
    const [day, month, year] = dayMonthYear.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

// Obtener la fecha actual formateada
export const todaytiny = new Date()
    .toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
    .replace(',', '')
    .trim()
export const today =
    todaytiny.charAt(0).toUpperCase() + todaytiny.slice(1).toLowerCase()


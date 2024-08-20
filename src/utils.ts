export const extractStreets = (place: string): string => {
    try {
        const url = new URL(place);
        const query = url.searchParams.get("query");
        return query || "No se encontró información";
    } catch (error) {
        return place;
    }
};

export const createGoogleMapsLink = (place: string): string => {
    const formattedPlace = encodeURIComponent(place);
    return `https://www.google.com/maps/search/?api=1&query=${formattedPlace}+, San Miguel, Buenos Aires, Argentina`;
};

export const formatDate = (date: string): string => {
    const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const dateObj = new Date(date);
    const dayName = daysOfWeek[dateObj.getDay()];
    const day = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth() + 1;
    const year = dateObj.getUTCFullYear();

    const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();
    return `${capitalizedDayName} ${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
};

export const revertDateFormat = (formattedDate: string): string => {
    const [, dayMonthYear] = formattedDate.split(" ");
    const [day, month, year] = dayMonthYear.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export const formatTime = (time: string): string => {
    return time;
};

export const revertTimeFormat = (formattedTime: string): string => {
    return formattedTime;
};

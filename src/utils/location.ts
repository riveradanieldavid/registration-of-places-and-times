// CALLES PUNTOS DE ENCUENTRO

// Función para crear el enlace de Google Maps
export const createGoogleMapsLink = (place: string) => {
  const formattedPlace = encodeURIComponent(place)
  return `https://www.google.com/maps/search/?api=1&query=${formattedPlace}+, San Miguel, Buenos Aires, Argentina`
}

// Función para extraer solo las calles ingresadas
export const extractStreets = (place: string): string => {
  // Verifica si 'place' tiene al menos el formato mínimo de una URL
  if (!place || !place.includes('?')) {
    // Si 'place' no parece una URL válida, devuelve el valor original o un mensaje adecuado
    return place;
  }
  try {
    const url = new URL(place);
    const query = url.searchParams.get('query');
    return query || 'No se encontró información';
  } catch (error) {
    console.error('Error al extraer calles:', error);
    return 'No se encontró información';
  }
}

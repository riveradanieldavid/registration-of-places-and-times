// @ts-nocheck

// Importaciones
import React, { useState } from 'react';
import '../App.css';
import '../styles.css';

interface DatesComponentProps {
    items: { id: number, date: string, time: string, meetingPoint: string }[];
    onEdit: (item: { id: number, date: string, time: string, meetingPoint: string }) => void;
    onDelete: (id: number) => void;
}

// INTERFACES
// Definición de la interfaz para los datos del formulario
interface FormData {
    id: number | null
    date: string
    time: string
    place: string // Dirección ingresada por el usuario
    servant: string
    territory: string
}

// Definición de la interfaz para los ítems de datos
interface DataItem extends FormData {
    id: number
    placeLink: string // Enlace generado a Google Maps
}

// FUNCION PRINCIPAL
const DatesComponent: React.FC<DatesComponentProps> = ({ items, onEdit, onDelete, isEditing, editingItemId }) => {
    // ESTADOS
    // Estado para manejar la fila expandida
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null)



    // EXPANDED
    // Función para manejar la expansión de una fila
    const handleExpand = (id: number) => {
        setExpandedRowId(expandedRowId === id ? null : id)
    }

    // VARIABLES Y FUNCIONES AUXILIARES
    // Obtener la fecha actual formateada
    const todaytiny = new Date()
        .toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
        .replace(',', '')
        .trim()
    const today =
        todaytiny.charAt(0).toUpperCase() + todaytiny.slice(1).toLowerCase()

    // FORMATEADORES
    // Función para formatear la fecha
    const formatDate = (date: string) => {
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

            // Verifica el nombre del día, el día, el mes y el año

            // Capitalizar el primer carácter del nombre del día
            const capitalizedDayName =
                dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase()

            // Función para formatear la hora
            const formattedDate = `${capitalizedDayName} ${day
                .toString()
                .padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
            return formattedDate
        } catch (error) {
            console.error('Error en formatDate:', error)
            return date // Devolver la fecha original en caso de error
        }
    }
    // Función para revertir el formato de la hora
    const revertDateFormat = (formattedDate: string) => {
        const [, dayMonthYear] = formattedDate.split(' ')
        const [day, month, year] = dayMonthYear.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    // Función para formatear la hora
    const formatTime = (time: string) => {
        return time
    }
    const revertTimeFormat = (formattedTime: string) => {
        return formattedTime
    }

    // CALLES PUNTOS DE ENCUENTRO
    // Función para extraer solo las calles ingresadas
    const extractStreets = (place: string): string => {
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

    // Función para crear el enlace de Google Maps
    const createGoogleMapsLink = (place: string) => {
        const formattedPlace = encodeURIComponent(place)
        return `https://www.google.com/maps/search/?api=1&query=${formattedPlace}+, San Miguel, Buenos Aires, Argentina`
    }


    // RETORNO DE LA FUNCION PRINCIPAL CrudApp
    return (
        // PRIMER DIV CONTAINER
        <div className='crud-app-container'>

            {/* LISTA DE ITEMS COLUMNAS Y FILAS*/}
            <div className='grid-container'>
                {/* CABECERAS COLUMNAS */}
                <div className='grid-header'>Día</div>
                <div className='grid-header'>Hora</div>
                <div className='grid-header'>Lugar</div>
                <div className='grid-header2 grid-header'>Conductor</div>
                <div className='grid-header2 grid-header'>Territorio</div>
                <div className='grid-header2 grid-header'>Acciones</div>
                {/* MAPEO DE data PARA MOSTRAR ITEMS */}
                {items.map(item => {
                    // Console log para depuración
                    // RETORNO MAPEO DE data
                    return (
                        <React.Fragment key={item.id}>
                            {/* COLUMNAS ITEMS DE data*/}
                            {/* DIA */}
                            <div
                                className={`grid-item ${item.date.trim() === today ? 'highlight' : ''
                                    } ${expandedRowId === item.id ? 'selected-row' : ''}`}
                            >
                                {item.date}
                                {item.date.trim() === today ? <h3>HOY</h3> : ''}
                            </div>
                            {/* HORA */}
                            <div
                                className={`grid-item ${item.date.trim() === today ? 'highlight' : ''
                                    } ${expandedRowId === item.id ? 'selected-row' : ''}`}
                            >
                                {formatTime(item.time)}
                                <span
                                    className='plus-icon'
                                    onClick={() => handleExpand(item.id)}
                                >
                                    {expandedRowId === item.id ? '-' : '+'}
                                </span>
                            </div>
                            {/* PUNTO DE ENCUENTRO */}
                            <div
                                className={`grid-item ${item.date.trim() === today ? 'highlight' : ''
                                    } ${expandedRowId === item.id ? 'selected-row' : ''}`}
                            >
                                {/* Aquí renderizas solo las calles */}
                                {extractStreets(item.place)}
                                {/* Aquí renderizas el enlace con la leyenda */}
                                <br />
                                <a
                                    href={item.placeLink}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32" id="google-maps"><path fill="#4285f4" d="M25.3959 8.8345l-.0039.0038c.0837.2319.1617.4667.2285.7062C25.5527 9.3047 25.48 9.067 25.3959 8.8345zM16 2.23L8.929 5.1593 12.9916 9.222A4.2486 4.2486 0 0 1 19.0208 15.21L25 9.23l.392-.392A9.9872 9.9872 0 0 0 16 2.23z"></path><path fill="#ffba00" d="M16,16.4733A4.25,4.25,0,0,1,12.9916,9.222L8.929,5.1593A9.9683,9.9683,0,0,0,6,12.23c0,4.4057,2.2651,7.1668,4.93,10,.1787.1828.3274.3852.4959.5746l7.5608-7.5609A4.2341,4.2341,0,0,1,16,16.4733Z"></path><path fill="#0066da" d="M16,2.23a10,10,0,0,0-10,10,11.0918,11.0918,0,0,0,.5454,3.4546l12.8505-12.85A9.9563,9.9563,0,0,0,16,2.23Z"></path><path fill="#00ac47" d="M16.9011,29.12a21.83,21.83,0,0,1,4.032-6.8966C23.7976,19.3129,26,16.636,26,12.23a9.9585,9.9585,0,0,0-.6041-3.3958l-13.97,13.97A18.0436,18.0436,0,0,1,15.0173,29.08.9975.9975,0,0,0,16.9011,29.12Z"></path><path fill="#0066da" d="M10.93 22.23c.1787.1828.3274.3852.4959.5746h0C11.257 22.6155 11.1083 22.4131 10.93 22.23zM7.207 7.4637A9.9357 9.9357 0 0 0 6.45 9.2566 9.9429 9.9429 0 0 1 7.207 7.4637zM6.45 9.2566a9.9522 9.9522 0 0 0-.398 1.9513A9.9537 9.9537 0 0 1 6.45 9.2566z" opacity=".5"></path><path fill="#fff" d="M15.1957 29.3989c.02.0248.0445.0422.0664.0644C15.24 29.4411 15.2156 29.4236 15.1957 29.3989zM15.7874 29.7429l.04.0066zM13.6216 25.9269c-.0371-.067-.0679-.1382-.1059-.2047C13.5533 25.789 13.5849 25.86 13.6216 25.9269zM15.0173 29.08q-.3069-.9036-.6906-1.7566C14.5793 27.8937 14.8127 28.4771 15.0173 29.08zM15.5269 29.6563c-.0229-.0112-.0463-.0207-.0684-.0338C15.4809 29.6356 15.5036 29.6452 15.5269 29.6563zM19.7117 23.7529c-.249.3474-.4679.7125-.6927 1.0741C19.2431 24.465 19.4633 24.1006 19.7117 23.7529z"></path><polygon fill="#fff" points="23.322 19.553 23.322 19.553 23.322 19.553 23.322 19.553"></polygon><path fill="#fff" d="M17.0468 28.774h0q.3516-.887.7561-1.7428C17.5316 27.6006 17.2812 28.1826 17.0468 28.774zM18.68 25.3584c-.2879.4957-.55 1.0068-.8 1.5242C18.13 26.3647 18.3931 25.8547 18.68 25.3584z"></path><path fill="#ea4435" d="M8.929,5.1593A9.9683,9.9683,0,0,0,6,12.23a11.0918,11.0918,0,0,0,.5454,3.4546L13,9.23Z"></path></svg>

                                </a>
                            </div>
                            {/* CONDUCTOR */}
                            <div
                                className={`grid-item2 grid-item ${item.date.trim() === today ? 'highlight' : ''
                                    } ${expandedRowId === item.id ? 'selected-row' : ''}`}
                            >
                                {item.servant}
                            </div>
                            {/* TERRITORIO */}
                            <div
                                className={`grid-item2 grid-item ${item.date.trim() === today ? 'highlight' : ''
                                    } ${expandedRowId === item.id ? 'selected-row' : ''}`}
                            >
                                {item.territory}
                            </div>
                            {/* ACCIONES */}
                            <div
                                className={`buttons-edit grid-item2 grid-item ${item.date.trim() === today ? 'highlight' : ''
                                    } ${expandedRowId === item.id ? 'selected-row' : ''}`}
                            >
                                <button className='editionButton' onClick={() => onEdit(item.id)}>
                                    {isEditing && editingItemId === item.id ? 'USTED ESTA EDITANDO ESTE ITEM' : 'Editar'}
                                </button>
                                <button className='editionButton' onClick={() => onDelete(item.id)}>Eliminar</button>
                            </div>
                            {/* ITEMS EXPANDIBLES EN MODO TELEFONO*/}
                            {expandedRowId === item.id && (
                                <div
                                    className={`expanded-info selected-row ${item.date.trim() === today ? 'highlight' : ''
                                        }`}
                                >
                                    {/* CONDUCTOR */}
                                    <div
                                        className={`grid-header-expanded grid-header ${item.date.trim() === today ? 'highlight' : ''
                                            }`}
                                    >
                                        Conductor
                                    </div>
                                    <div
                                        className={`grid-item expand-content selected-row grid-header ${item.date.trim() === today ? 'highlight' : ''
                                            }`}
                                    >
                                        {item.servant}
                                    </div>
                                    {/* TERRITORIO */}
                                    <div
                                        className={`grid-header-expanded grid-header ${item.date.trim() === today ? 'highlight' : ''
                                            }`}
                                    >
                                        Territorio
                                    </div>
                                    <div
                                        className={`grid-item expand-content selected-row grid-header ${item.date.trim() === today ? 'highlight' : ''
                                            }`}
                                    >
                                        {item.territory}
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default DatesComponent

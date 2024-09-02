//@ts-nocheck
// Importaciones
import './App.css';
import './styles.css';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import DatesComponent from './components/DatesListComponent';
import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import { DataItem, FormData } from './interfaces/types';
import { formatDate, formatTime, revertDateFormat, revertTimeFormat } from './utils/formatters';
import { createGoogleMapsLink, extractStreets } from './utils/location';

// FUNCION PRINCIPAL
const DatesCrudApp = () => {

  // ESTADOS

  // Estado para almacenar los datos
  const [data, setData] = useState<DataItem[]>([])

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState<FormData>({
    id: null,
    date: '',
    time: '',
    place: '',
    servant: '',
    territory: ''
  })

  // BUTTON AGREGAR
  const [showFormAddItem, setShowFormAddItem] = useState<boolean>(false)

  // Estado para determinar si está en modo edición
  const [isEditing, setIsEditing] = useState<boolean>(false)

  // Estado para mostrar mensajes
  const [message, setMessage] = useState('')

  // Estado para determinar el ID del ítem en edición
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  // EFECTOS SECUNDARIOS

  // Efecto para cargar datos del archivo JSON
  useEffect(() => {
    fetch("/registration-of-places-and-times/data.json")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`)
        }
        return response.json()
      })
      .then(jsonData => {
        setData(jsonData)
      })
      .catch(err => {
        console.error('Error loading JSON:', err.message)
      })
  }, [])
  // console.log(data)

  // Focus en formulario siempre
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    // Enfocar el input cuando se esté editando
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingItemId]);




  // Evento para salir del modo edición si se hace clic fuera del formulario
  const formRef = useRef<HTMLFormElement | null>(null)
  const buttonAddRef = useRef<HTMLFormElement | null>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si se hace clic fuera del formulario y no en el botón "Editar", cerrar el modo edición
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
        setMessage(false);
      }
/*       if (
        formRef.current &&
        !formRef.current.contains(event.target as Node)
      ) {
        buttonAddRef.current &&
          buttonAddRef.current.contains(event.target as Node)
      }
 */    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // MANEJADORES DE EVENTOS DE FORMULARIO

  // Manejar cambios en el formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    localStorage.setItem(
      'formData',
      // Función para extraer solo las calles ingresadas. Sirve de algo?
      JSON.stringify({ ...formData, [e.target.name]: e.target.value })
    )
  }

  // Función para manejar el envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formattedDate = formatDate(formData.date)
    const formattedTime = formatTime(formData.time)
    // Crear un enlace de Google Maps a partir de la dirección
    const googleMapsLink = createGoogleMapsLink(formData.place)
    const updatedData = isEditing
      ? data.map(item =>
        item.id === formData.id
          ? {
            ...formData,
            id: item.id,
            date: formattedDate,
            time: formattedTime,
            place: formData.place,
            placeLink: googleMapsLink
          }
          : item
      )
      : [
        ...data,
        {
          ...formData,
          id: Date.now(),
          date: formattedDate,
          time: formattedTime,
          place: formData.place,
          placeLink: googleMapsLink
        }
      ]
    setData(updatedData)
    setIsEditing(false)
    localStorage.setItem('data', JSON.stringify(updatedData))
    localStorage.setItem('formData', JSON.stringify(formData))
    if (isEditing) {
      showMessage('updated')
    } else {
      showMessage('added')
    }
    console.log(updatedData)
  }

  // VARIABLES Y FUNCIONES AUXILIARES
  // MENSAJES DE ACCIONES DE EDICION
  // Función para mostrar mensajes de acción de edición
  const showMessage = (type: string) => {
    const messages: { [key: string]: string } = {
      updated: 'ITEM ACTUALIZADO',
      added: 'ITEM DUPLICADO.'
    }
    setMessage(messages[type])
    // setTimeout(() => {
    //   setMessage('')
    // }, 70000)
  }

  // Función para manejar la edición de un ítem
  const handleEdit = (id: number) => {
    setEditingItemId(id); // Establece la ID del ítem en edición
    // Aquí iría tu lógica adicional para editar el ítem...
    const itemToEdit = data.find(item => item.id === id)
    if (itemToEdit) {
      const originalDate = revertDateFormat(itemToEdit.date)
      const originalTime = revertTimeFormat(itemToEdit.time)
      setFormData({
        ...itemToEdit,
        date: originalDate,
        time: originalTime,
        place: extractStreets(itemToEdit.place)
      })
      setIsEditing(true);
    }
  }

  // Función para manejar la eliminación de un ítem
  const handleDelete = (id: number) => {
    const itemToDelete = data.find(item => item.id === id)
    if (itemToDelete) {
      const confirmDelete = window.confirm(
        `Eliminar fecha ${itemToDelete.date} en ${itemToDelete.place}?`
      )
      // QUITAR LA NEGACION PARA CONFIRMAR DELETE
      if (confirmDelete) {
        const updatedData = data.filter(item => item.id !== id)
        setData(updatedData)
        localStorage.setItem('data', JSON.stringify(updatedData))
      }
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // RETORNO DE LA FUNCION PRINCIPAL DatesCrudApp
  return (
    // PRIMER DIV CONTAINER
    <div className='crud-app-container'>

      {/* HEADER */}
      <HeaderComponent />
      {/* FORM */}
      {/* CRUD */}

      {isEditing &&
        <form
          ref={formRef}
          className='crud-form'
          onSubmit={handleSubmit}>
          <input
            ref={inputRef} // Usamos la referencia aquí
            type='date'
            name='date'
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type='time'
            name='time'
            value={formData.time}
            onChange={handleChange}
            required
          />
          <input
            type='text'
            name='place'
            placeholder='Calle y Calle | Dirección | Sitio Encuentro'
            value={formData.place} // Muestra solo la dirección ingresada
            onChange={handleChange}
            required
          />
          <input
            type='text'
            name='servant'
            placeholder='Conductor'
            value={formData.servant}
            onChange={handleChange}
            required
          />
          <input
            type='text'
            name='territory'
            placeholder='Territorio'
            value={formData.territory}
            onChange={handleChange}
            required
          />
          <button
            type='submit'
            className='submit-button'
          // className={`submit-button ${message ? 'hidden' : ''}{isEditing ? 'show' : '' }`}
          // className={`submit-button ${message ? 'hidden' : ''}`}
          >
            {isEditing ? 'ACTUALIZAR' : 'AGREGAR'}
          </button>
          {/* <span className={`message ${message ? 'show' : 'hidden'}`}> */}
          {/* {message} */}
          {/* </span> */}
        </form>
      }
      {/* LISTA DE ITEMS COLUMNAS Y FILAS*/}
      <DatesComponent
        data={data}
        handleEdit={handleEdit}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        isEditing={isEditing}
        editingItemId={editingItemId}
        formRef={formRef}
        handleChange={handleChange}
        buttonAddRef={buttonAddRef}
        message={message}
        isModalOpen={isModalOpen}
        openModal={openModal}
        closeModal={closeModal}
      />

      {/* FOOTER */}
      < FooterComponent />

    </div>

  )
}

export default DatesCrudApp
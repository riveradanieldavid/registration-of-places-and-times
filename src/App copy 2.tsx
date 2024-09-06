import { ChangeEvent, FormEvent, useRef, useState } from "react";

import "./App.css";
import DatesComponent from "./components/DatesListComponent";
import FooterComponent from "./components/FooterComponent";
import HeaderComponent from "./components/HeaderComponent";
import { DataItem, FormData } from "./interfaces/types";
import "./styles.css";
import {
  useAutoFocus,
  useClickOutsideToClose,
  useFetchData
} from "./utils/effects";
import {
  formatDate,
  formatTime,
  revertDateFormat,
  revertTimeFormat
} from "./utils/formatters";
import { createGoogleMapsLink, extractStreets } from "./utils/location";
import { useMessage } from "./utils/messages";

// ***************************COMPONENTE***************************
const DatesCrudApp = () => {
  //*************************** ESTADOS***************************
  // Estado para almacenar los datos
  const [data, setData] = useState<DataItem[]>([]);
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    date: "",
    time: "",
    place: "",
    servant: "",
    territory: ""
  });
  // Estado para determinar si está en modo edición
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Estado para determinar el ID del ítem en edición
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  //*************************** FORM CRUD***************************
  // Manejar cambios en el formulario
  // EXTRAE VAORES DE inputs y  LOS GUARDA EN formData
  // EXTRAE CALLES INGESADAS DEL LINK FORMADO
  // ALMACENA DATOS EN localStorage
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    localStorage.setItem(
      "formData",
      // Función para extraer solo las calles ingresadas. Sirve de algo?
      JSON.stringify({ ...formData, [e.target.name]: e.target.value })
    );
  };
  // Función para manejar el envío del formulario
  // FORMATEA FECHA, HORA Y CREA ENLACE DE GOOGLE MAPS
  // GUARDA EN updatedData LA EDICION DE data del id SELECIONADO
  // O GUARDA DATOS NUEVOS INGRESADOS ALMACENADOS EN ...formData, MAS ...data
  // updateData SE GUARDA EN data
  // SALE DE MODO EDICION
  // DATOS SE ALMACENAN EN localStorage
  // SI ESTUVO EN MODO EDICION SE MUESTRAN MENSAJES DE ACTUALIZACION
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedDate = formatDate(formData.date);
    const formattedTime = formatTime(formData.time);
    // Crear un enlace de Google Maps a partir de la dirección
    const googleMapsLink = createGoogleMapsLink(formData.place);
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
        ];
    setData(updatedData);
    setIsEditing(false);
    localStorage.setItem("data", JSON.stringify(updatedData));
    localStorage.setItem("formData", JSON.stringify(formData));
    if (isEditing) {
      showMessage("updated");
    } else {
      showMessage("added");
    }
    console.log(updatedData);
  };
  // Función para manejar la edición de un ítem
  // EN itemToEdit GUARDA EL id DEL ITEM A EDITAR
  // SI itemToEdit PONE EN formData LOS DATOS DEL ITEM A EDITAR
  // MARCA isEditing COMO EDITABLE
  // LOS inputs QUEDAN CON LOS DATOS DEL ITEM A EDITAR
  const handleEdit = (id: number) => {
    setEditingItemId(id); // Establece la ID del ítem en edición
    const itemToEdit = data.find(item => item.id === id);
    if (itemToEdit) {
      const originalDate = revertDateFormat(itemToEdit.date);
      const originalTime = revertTimeFormat(itemToEdit.time);
      setFormData({
        ...itemToEdit,
        date: originalDate,
        time: originalTime,
        place: extractStreets(itemToEdit.place)
      });
      setIsEditing(true);
    }
  };
  // Función para manejar la eliminación de un ítem
  const handleDelete = (id: number) => {
    const itemToDelete = data.find(item => item.id === id);
    if (itemToDelete) {
      const confirmDelete = window.confirm(
        `Eliminar fecha ${itemToDelete.date} en ${itemToDelete.place}?`
      );
      // QUITAR LA NEGACION PARA CONFIRMAR DELETE
      if (confirmDelete) {
        const updatedData = data.filter(item => item.id !== id);
        setData(updatedData);
        localStorage.setItem("data", JSON.stringify(updatedData));
      }
    }
  };

  //*************************** EFECTOS***************************
  // fetch DATA ITEMS
  useFetchData(setData);
  // Hook useMessage para mostrar mensajes  // useClickOutsideToClose establece showMessage null
  const { message, showMessage } = useMessage();
  // useClickOutsideToClose original no funcional con setMessage
  // const [message, setMessage] = useState("");

  // useClickOutsideToClose cierra formulario y mensajes de botones de edición
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useClickOutsideToClose(formRef, buttonRef, setIsEditing, showMessage);

  //Hook autoenfoca el input
  useAutoFocus(inputRef, isEditing);

  //*************************** RENDERIZADO***************************
  return (
    <div className="crud-app-container">
      {/**************************** HEADER****************************/}
      <HeaderComponent />
      {/* <TestOne /> */}

      {/* ***************************FORM ****************************/}
      {isEditing && (
        <form ref={formRef} className="crud-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef} // Usamos la referencia aquí
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="place"
            placeholder="Calle y Calle | Dirección | Sitio Encuentro"
            value={formData.place} // Muestra solo la dirección ingresada
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="servant"
            placeholder="Conductor"
            value={formData.servant}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="territory"
            placeholder="Territorio"
            value={formData.territory}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="submit-button"
            // className={`submit-button ${message ? 'hidden' : ''}{isEditing ? 'show' : '' }`}
            // className={`submit-button ${message ? 'hidden' : ''}`}
          >
            {isEditing ? "ACTUALIZAR" : "AGREGAR"}
          </button>
          {/* <span className={`message ${message ? 'show' : 'hidden'}`}> */}
          {/* {message} */}
          {/* </span> */}
        </form>
      )}

      {/* ***************************LISTA DE ITEMS*************************** */}
      <DatesComponent
        data={data}
        editingItemId={editingItemId}
        isEditing={isEditing}
        buttonRef={buttonRef}
        message={message}
        handleEdit={handleEdit}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
      />

      {/* ***************************FOOTER ****************************/}
      <FooterComponent />
    </div>
  );
};

export default DatesCrudApp;

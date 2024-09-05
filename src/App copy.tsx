import { ChangeEvent, FormEvent, useRef, useState } from "react";

import DatesComponent from "./components/DatesListComponent";
import FooterComponent from "./components/FooterComponent";
import HeaderComponent from "./components/HeaderComponent";
import { DataItem, FormData } from "./interfaces/types";
import {
  useClickOutsideToClose,
  useFetchData,
  useAutoFocus
} from "./utils/effects"; // Importas la función desde efectos.ts
import {
  formatDate,
  formatTime,
  revertDateFormat,
  revertTimeFormat
} from "./utils/formatters";
import { createGoogleMapsLink, extractStreets } from "./utils/location";
import { useMessage } from "./utils/messages";
import "./App.css";
import "./styles.css";

// FUNCION PRINCIPAL
const DatesCrudApp = () => {
  // ESTADOS
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
  // Estado para mostrar mensajes
  // Estado para determinar el ID del ítem en edición
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  // Funciones, hooks, effects modularizados
  // Effects useReferrer
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Usa el hook para gestionar mensajes
  const { message, showMessage } = useMessage();
  // useClickOutsideToClose
  // const [message, setMessage] = useState("");

  // FUNCIONES DE EDICION
  // Manejar cambios en el formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    localStorage.setItem(
      "formData",
      // Función para extraer solo las calles ingresadas. Sirve de algo?
      JSON.stringify({ ...formData, [e.target.name]: e.target.value })
    );
  };

  // Función para manejar el envío del formulario
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
  const handleEdit = (id: number) => {
    setEditingItemId(id); // Establece la ID del ítem en edición
    // Aquí iría tu lógica adicional para editar el ítem...
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

  // EFECTOS SECUNDARIOS
  // Llamas a la función de efectos que contiene el useEffect
  useFetchData(setData);

  // Llamada a la función para manejar el clic fuera del formulario
  useClickOutsideToClose(formRef, buttonRef, setIsEditing, showMessage);

  // Usa el hook para autoenfocar el input
  useAutoFocus(inputRef, isEditing);

  // VARIABLES Y FUNCIONES AUXILIARES

  return (
    <div className="crud-app-container">
      {/* HEADER */}
      <HeaderComponent />
      {/* <TestOne /> */}

      {/* FORM */}
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

      {/* LISTA DE ITEMS COLUMNAS Y FILAS*/}
      <DatesComponent
        data={data}
        editingItemId={editingItemId}
        isEditing={isEditing}
        buttonRef={buttonRef}
        message={message}
        handleEdit={handleEdit}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        // handleChange={handleChange}
        // formRef={formRef}
      />

      {/* FOOTER */}
      <FooterComponent />
    </div>
  );
};

export default DatesCrudApp;

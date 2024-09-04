import React, { useEffect, useState } from "react";

import { DatesComponentProps } from "../interfaces/types";
import { formatTime, today } from "../utils/formatters";
import { extractStreets } from "../utils/location";
import ExpandedComponent from "./ExpandedComponent";

import "../styles.css";
import "../styles.css";

// FUNCION PRINCIPAL
const DatesComponent: React.FC<DatesComponentProps> = ({
  data,
  handleSubmit,
  handleEdit,
  // handleDelete,
  isEditing,
  editingItemId,
  message,
  buttonRef
}) => {
  // ESTADOS
  // Estado para almacenar los datos
  // const [data, setData] = useState<DataItem[]>([]);
  // Estado para manejar la fila expandida
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  // Efecto para cargar datos del archivo JSON
  useEffect(() => {
    fetch("/registration-of-places-and-times/data.json")
      .then(response => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then(jsonItems => {
        setItems(jsonItems);
      })
      .catch(err => {
        console.error("Error loading JSON:", err.message);
      });
  }, []);

  // EXPANDED
  // Función para manejar la expansión de una fila
  const handleExpand = (id: number) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  // GUARDA PREVIO DATO DE LA ITERACION MAP
  // La variable prevDate se inicializa fuera de la función map,
  // lo que significa que su valor es persistente durante toda la iteración de map.
  // Es decir, su valor se mantiene entre cada ciclo de la iteración.
  let prevDate = ""; // Inicializamos la fecha anterior

  //INTERFACES
  interface Item {
    id: number; // Identificador único del ítem.
    date: string; // Fecha asociada al ítem.
    time: string; // Hora asociada al ítem.
    place: string;
    servant: string;
    territory: string;
  }

  // ESTADOS
  // Estado para almacenar la lista de ítems.
  const [items, setItems] = useState<Item[]>([]);
  // Estado para manejar el ítem actualmente en edición o creación.
  const [currentItem, setCurrentItem] = useState<Item>({
    id: 0,
    date: "",
    time: "",
    place: "",
    servant: "",
    territory: ""
  });
  // Estado para manejar el modo de edición (almacena el id del ítem en edición o null si no se está editando).
  const [editMode, setEditMode] = useState<number | null>(null);

  // FUNCIONES DE EDICION

  // ADICION
  // Maneja los cambios en los inputs del formulario principal (nombre, fecha, hora).
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Extraemos el nombre del input y su valor.
    // Actualizamos el estado del ítem actual con los nuevos valores ingresados.
    setCurrentItem({ ...currentItem, [name]: value });
  };
  // Maneja la adición de un nuevo ítem o la edición de uno existente.
  const handleAddItem = () => {
    // Verifica que todos los campos estén llenos.
    if (
      currentItem.date.trim() === "" ||
      currentItem.time.trim() === "" ||
      currentItem.place.trim() === "" ||
      currentItem.servant.trim() === "" ||
      currentItem.territory.trim() === ""
    )
      return;

    // Si estamos agregando un nuevo ítem (no en modo de edición).
    if (currentItem.id === 0) {
      // Creamos un nuevo array con el nuevo ítem (usando una marca de tiempo como id único).
      const newItems = [...items, { ...currentItem, id: Date.now() }];
      // Ordenamos los ítems después de agregar el nuevo.
      setItems(sortItemsByDateAndTime(newItems));
    }

    // Reseteamos el formulario y salimos del modo de edición.
    setCurrentItem({
      id: 0,
      date: "",
      time: "",
      place: "",
      servant: "",
      territory: ""
    });
    setEditMode(null);
  };

  // EDICION
  // Activa el modo de edición para un ítem específico.
  const handleEditItem = (item: Item) => {
    setEditMode(item.id); // Establece el id del ítem que se está editando.
    setCurrentItem(item); // Carga los datos del ítem en el formulario para su edición.
  };
  // Maneja los cambios en los inputs de un ítem en edición dentro de la lista.
  const handleItemInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const { name, value } = e.target;
    // Actualiza y ordena los ítems en la lista según los nuevos valores ingresados.
    setItems(prevItems =>
      sortItemsByDateAndTime(
        prevItems.map(item =>
          item.id === id ? { ...item, [name]: value } : item
        )
      )
    );
  };

  // GUARDAR, ELIMINAR DATOS
  // Guarda los cambios después de editar un ítem.
  const handleSaveEdit = () => {
    setItems(sortItemsByDateAndTime(items)); // Ordena los ítems después de guardar los cambios.
    setCurrentItem({
      id: 0,
      date: "",
      time: "",
      place: "",
      servant: "",
      territory: ""
    }); // Resetea el formulario.
    setEditMode(null); // Sale del modo de edición.
  };
  // Elimina un ítem de la lista.
  const handleDeleteItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // UTILS, ORDENA ITEMS POR FECHA Y HORA
  // Función para ordenar los ítems por fecha y luego por hora.
  const sortItemsByDateAndTime = (itemsToSort: Item[]) => {
    return itemsToSort.sort((a, b) => {
      // Comparación por fecha.
      const dateComparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison; // Si las fechas son diferentes, ordena por fecha.
      // Si las fechas son iguales, se ordena por hora.
      return a.time.localeCompare(b.time);
    });
  };

  //   RENDERIZADO DEL COMPONENTE DATES
  return (
    <div className="crud-dates-list">
      {/* FORMULARIO para agregar o editar ítems */}
      <form>
        <input
          type="time"
          name="time"
          value={currentItem.time}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="date"
          value={currentItem.date}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="place"
          value={currentItem.place}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="servant"
          value={currentItem.servant}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="territory"
          value={currentItem.territory}
          onChange={handleInputChange}
        />
        <button onClick={handleAddItem} type="button">
          Agregar
        </button>
      </form>

      {/*  LISTA GRID*/}
      <div className="grid-container">
        {/* CABECERAS */}
        <div className="grid-header">Día</div>
        <div className="grid-header">Hora</div>
        <div className="grid-header">Lugar</div>
        <div className="expand-header grid-header">Conductor</div>
        <div className="expand-header grid-header">Territorio</div>
        <div className="expand-header grid-header">Acciones</div>

        {/* MAPEO DATOS*/}
        {data.map(item => {
          // Compara la fecha del item actual con prevDate:
          // Aquí, item.date.trim() es la fecha del item actual, y se compara con prevDate (la fecha guardada del item anterior). Si son iguales, isSameDateAsPrevious será true, lo que significa que la fecha ya fue mostrada en el item anterior.
          const isSameDateAsPrevious = item.date.trim() === prevDate;
          // Actualizamos prevDate para la próxima iteración
          prevDate = item.date.trim();

          return (
            <React.Fragment key={item.id}>
              {/* MAPEO DATOS*/}
              <div key={item.id} className="item">
                {/* CONDICIONAL MODO MOSTRAR DATOS */}
                {editMode === item.id ? (
                  // MODO EDICION
                  <>
                    <input
                      type="date"
                      name="date"
                      value={item.date}
                      onChange={e => handleItemInputChange(e, item.id)}
                    />
                    <input
                      type="time"
                      name="time"
                      value={item.time}
                      onChange={e => handleItemInputChange(e, item.id)}
                    />
                    <input
                      type="text"
                      name="place"
                      value={item.place}
                      onChange={e => handleItemInputChange(e, item.id)}
                    />
                    <input
                      type="text"
                      name="servant"
                      value={item.servant}
                      onChange={e => handleItemInputChange(e, item.id)}
                    />
                    <input
                      type="text"
                      name="territory"
                      value={item.territory}
                      onChange={e => handleItemInputChange(e, item.id)}
                    />
                    <div className="item-actions">
                      <button onClick={handleSaveEdit}>Guardar</button>
                    </div>
                  </>
                ) : (
                  // MODO TEXTO
                  <>
                    {/* DIA */}
                    <div
                      className={`grid-item ${
                        item.date.trim() === today ? "highlight" : ""
                      } ${expandedRowId === item.id ? "selected-row" : ""}`}
                    >
                      {/* Solo mostramos la fecha si es diferente de la fecha anterior */}
                      {!isSameDateAsPrevious && item.date.trim()}
                      {item.date.trim() === today && <h3>HOY</h3>}
                    </div>
                    {/* HORA */}
                    <div
                      className={`grid-item ${
                        item.date.trim() === today ? "highlight" : ""
                      } ${expandedRowId === item.id ? "selected-row" : ""}`}
                    >
                      {formatTime(item.time)}
                      <span
                        className="plus-icon"
                        onClick={() => handleExpand(item.id)}
                      >
                        {expandedRowId === item.id ? "-" : "+"}
                      </span>
                    </div>
                    {/* PUNTO DE ENCUENTRO */}
                    <div
                      className={`grid-item ${
                        item.date.trim() === today ? "highlight" : ""
                      } ${expandedRowId === item.id ? "selected-row" : ""}`}
                    >
                      {/* Aquí mestras solo las calles */}
                      {extractStreets(item.place)}
                      {/* Aquí muestras el enlace con la leyenda */}
                      <br />
                      <a
                        href={item.territory}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          viewBox="0 0 32 32"
                          id="google-maps"
                        >
                          <path
                            fill="#4285f4"
                            d="M25.3959 8.8345l-.0039.0038c.0837.2319.1617.4667.2285.7062C25.5527 9.3047 25.48 9.067 25.3959 8.8345zM16 2.23L8.929 5.1593 12.9916 9.222A4.2486 4.2486 0 0 1 19.0208 15.21L25 9.23l.392-.392A9.9872 9.9872 0 0 0 16 2.23z"
                          ></path>
                          <path
                            fill="#ffba00"
                            d="M16,16.4733A4.25,4.25,0,0,1,12.9916,9.222L8.929,5.1593A9.9683,9.9683,0,0,0,6,12.23c0,4.4057,2.2651,7.1668,4.93,10,.1787.1828.3274.3852.4959.5746l7.5608-7.5609A4.2341,4.2341,0,0,1,16,16.4733Z"
                          ></path>
                          <path
                            fill="#0066da"
                            d="M16,2.23a10,10,0,0,0-10,10,11.0918,11.0918,0,0,0,.5454,3.4546l12.8505-12.85A9.9563,9.9563,0,0,0,16,2.23Z"
                          ></path>
                          <path
                            fill="#00ac47"
                            d="M16.9011,29.12a21.83,21.83,0,0,1,4.032-6.8966C23.7976,19.3129,26,16.636,26,12.23a9.9585,9.9585,0,0,0-.6041-3.3958l-13.97,13.97A18.0436,18.0436,0,0,1,15.0173,29.08.9975.9975,0,0,0,16.9011,29.12Z"
                          ></path>
                          <path
                            fill="#0066da"
                            d="M10.93 22.23c.1787.1828.3274.3852.4959.5746h0C11.257 22.6155 11.1083 22.4131 10.93 22.23zM7.207 7.4637A9.9357 9.9357 0 0 0 6.45 9.2566 9.9429 9.9429 0 0 1 7.207 7.4637zM6.45 9.2566a9.9522 9.9522 0 0 0-.398 1.9513A9.9537 9.9537 0 0 1 6.45 9.2566z"
                            opacity=".5"
                          ></path>
                          <path
                            fill="#fff"
                            d="M15.1957 29.3989c.02.0248.0445.0422.0664.0644C15.24 29.4411 15.2156 29.4236 15.1957 29.3989zM15.7874 29.7429l.04.0066zM13.6216 25.9269c-.0371-.067-.0679-.1382-.1059-.2047C13.5533 25.789 13.5849 25.86 13.6216 25.9269zM15.0173 29.08q-.3069-.9036-.6906-1.7566C14.5793 27.8937 14.8127 28.4771 15.0173 29.08zM15.5269 29.6563c-.0229-.0112-.0463-.0207-.0684-.0338C15.4809 29.6356 15.5036 29.6452 15.5269 29.6563zM19.7117 23.7529c-.249.3474-.4679.7125-.6927 1.0741C19.2431 24.465 19.4633 24.1006 19.7117 23.7529z"
                          ></path>
                          <polygon
                            fill="#fff"
                            points="23.322 19.553 23.322 19.553 23.322 19.553 23.322 19.553"
                          ></polygon>
                          <path
                            fill="#fff"
                            d="M17.0468 28.774h0q.3516-.887.7561-1.7428C17.5316 27.6006 17.2812 28.1826 17.0468 28.774zM18.68 25.3584c-.2879.4957-.55 1.0068-.8 1.5242C18.13 26.3647 18.3931 25.8547 18.68 25.3584z"
                          ></path>
                          <path
                            fill="#ea4435"
                            d="M8.929,5.1593A9.9683,9.9683,0,0,0,6,12.23a11.0918,11.0918,0,0,0,.5454,3.4546L13,9.23Z"
                          ></path>
                        </svg>
                      </a>
                    </div>
                    {/* CONDUCTOR */}
                    <div
                      className={`expand-info grid-item ${
                        item.date.trim() === today ? "highlight" : ""
                      } ${expandedRowId === item.id ? "selected-row" : ""}`}
                    >
                      {item.servant}
                    </div>
                    {/* TERRITORIO */}
                    <div
                      className={`expand-info grid-item ${
                        item.date.trim() === today ? "highlight" : ""
                      } ${expandedRowId === item.id ? "selected-row" : ""}`}
                    >
                      {item.territory}
                    </div>
                    {/* ACCIONES */}
                    <div
                      className={`buttons-edit expand-info grid-item 
                                ${
                                  item.date.trim() === today ? "highlight" : ""
                                } 
                                ${
                                  expandedRowId === item.id
                                    ? "selected-row"
                                    : ""
                                }
                                ${
                                  isEditing && editingItemId === item.id
                                    ? "grid-edition-actions"
                                    : ""
                                }
                                `}
                    >
                      {/* BOTON EDITAR */}
                      <button
                        className={`'editionButton' ${
                          isEditing && editingItemId === item.id
                            ? "editingButton"
                            : ""
                        }`}
                        // onClick={() => handleEditItem(item)}
                        onClick={e => {
                          e.stopPropagation();
                          handleEditItem(item);
                        }}

                        // disabled={isEditing && editingItemId !== item.id}
                      >
                        {isEditing && editingItemId === item.id
                          ? "SE ESTA EDITANDO ESTE ITEM"
                          : "EDITAR"}
                      </button>
                      {/* MESSAGE ITEM ACTUALIZADO */}
                      {!isEditing && (
                        <button
                          ref={buttonRef}
                          className={`message ${
                            message && editingItemId === item.id
                              ? "show"
                              : "hidden"
                          }`}
                        >
                          {message}
                        </button>
                      )}
                      {/* BOTON ELIMINAR */}
                      <button
                        className="editionButton"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        ELIMINAR
                      </button>
                      {/* BOTON DUPLICAR | AGREGAR */}
                      <form onSubmit={handleSubmit}>
                        <button
                          type="submit"
                          className="submit-button"
                          onClick={() => {
                            handleEdit(item.id);
                          }}
                        >
                          DUPLICAR
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </div>

              <ExpandedComponent
                expandedRowId={expandedRowId}
                item={item}
                today={today}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default DatesComponent;

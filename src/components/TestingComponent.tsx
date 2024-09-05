import React, { useState } from "react";
import "../App.css";

//INTERFACES
interface Item {
  id: number; // Identificador único del ítem.
  name: string; // Nombre o descripción del ítem.
  date: string; // Fecha asociada al ítem.
  time: string; // Hora asociada al ítem.
}

// COMPONENTE PRINCIPAL
const TestOne: React.FC = () => {
  // ESTADOS
  // Estado para almacenar la lista de ítems.
  const [items, setItems] = useState<Item[]>([]);
  // Estado para manejar el ítem actualmente en edición o creación.
  const [currentItem, setCurrentItem] = useState<Item>({
    id: 0,
    name: "",
    date: "",
    time: ""
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
      currentItem.name.trim() === "" ||
      currentItem.date.trim() === "" ||
      currentItem.time.trim() === ""
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
    setCurrentItem({ id: 0, name: "", date: "", time: "" });
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
    setCurrentItem({ id: 0, name: "", date: "", time: "" }); // Resetea el formulario.
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

  return (
    <div className="container">
      {/* HEADER */}
      <h1>CRUD en Tiempo Real con Orden por Fecha y Hora</h1>

      {/* FORMULARIO para agregar o editar ítems */}
      <form>
        <input
          type="text"
          name="name"
          value={currentItem.name}
          onChange={handleInputChange}
          placeholder="Escribe el nombre..."
        />
        <input
          type="date"
          name="date"
          value={currentItem.date}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="time"
          value={currentItem.time}
          onChange={handleInputChange}
        />
        <button onClick={handleAddItem} type="button">
          Agregar
        </button>
      </form>

      {/* LISTA de ítems en forma de grilla */}
      <ul className="items-grid">
        {/* CABECERAS */}
        <li className="items-header">
          <span>Fecha</span>
          <span>Hora</span>
          <span>Nombre</span>
          <span>Acciones</span>
        </li>
        {/* DATOS ITERADOS */}
        {items.map(item => (
          // CONDICIONAL MODO MOSTRAR DATOS
          <li key={item.id} className="item">
            {/* Si el ítem está en modo de edición, mostramos inputs editables */}
            {editMode === item.id ? (
              // INPUTS
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
                  name="name"
                  value={item.name}
                  onChange={e => handleItemInputChange(e, item.id)}
                />
                <div className="item-actions">
                  <button onClick={handleSaveEdit}>Guardar</button>
                </div>
              </>
            ) : (
              // Si no está en modo de edición, mostramos los datos como texto
              <>
                <span>{item.date}</span>
                <span>{item.time}</span>
                <span>{item.name}</span>
                <div className="item-actions">
                  {/* Botones para editar o eliminar el ítem */}
                  <button onClick={() => handleEditItem(item)}>Editar</button>
                  <button onClick={() => handleDeleteItem(item.id)}>
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestOne;

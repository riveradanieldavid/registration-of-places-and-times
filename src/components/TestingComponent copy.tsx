import React, { useState } from "react";
import "../App.css";

//***************************INTERFACES***************************
interface Item {
  id: number; // Identificador único del ítem.
  name: string; // Nombre o descripción del ítem.
  date: string; // Fecha asociada al ítem.
  time: string; // Hora asociada al ítem.
}

//*************************** COMPONENTE***************************
const TestOne: React.FC = () => {
  // ***************************ESTADOS***************************
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

  //*************************** FORM CRUD***************************
  // Maneja los cambios en los inputs del formulario principal.
  // EXTRAER DATOS INGRESADOS, name y value... DEL FORMULARIO
  // ACTUALIZA currentItem CON DATOS NUEVOS PARA EL FORMULARIO
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Extraemos el nombre del input y su valor.
    // Actualizamos el estado del ítem actual con los nuevos valores ingresados.
    setCurrentItem({ ...currentItem, [name]: value });
  };
  // Maneja la adición de un nuevo ítem o la edición de uno existente
  // SI TODOS LOS CAMPOS ESTAN LLENOS
  // SI NO HAY ITEM PARA EDICION...
  // CREA Y GUARDA UN NUEVO ITEM EN items con setITems...
  // ORDENAR POR FECHA Y HORA...
  // Y VACIAR FORMULARIO.
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
  // Activa el modo de edición para un ítem específico.
  // PONE LOS DATOS DE currentItem EN EL FORMULARIO.
  // ACTIVA EL MODO DE EDICION PARA UN ítEM ESPECÍFICO.
  const handleEditItem = (item: Item) => {
    setEditMode(item.id); // Establece el id del ítem que se está editando.
    setCurrentItem(item); // Carga los datos del ítem en el formulario para su edición.
  };
  // Asegura que los ítems estén correctamente ordenados y limpia los campos del formulario, además de salir del modo de edición.
  // VUELVE A OREDENAR LOS items, LIMPIA EL FORMULARIO Y SALE DEL MODO DE EDICION.
  const handleSaveEdit = () => {
    setItems(sortItemsByDateAndTime(items)); // Ordena los ítems después de guardar los cambios.
    setCurrentItem({ id: 0, name: "", date: "", time: "" }); // Resetea el formulario.
    setEditMode(null); // Sale del modo de edición.
  };
  // Elimina un ítem de la lista.
  const handleDeleteItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // *********************INPUTS EDITABLES SOBRE LA LISTA***************************
  // Guarda los cambios en tiempo real mientras el usuario edita un ítem directamente en la lista.
  // EXTRAE DE LA LISTA DE ITEMS, NO DEL FORMULARIO, LOS VALORES DEL input, name y value
  // GUARDA EN TIEMPO REAL LOS VALORES DEL input, name y value ORDENADOS POR FECHA Y HORA  EN items
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

  //*************************** UTILIDADES***************************
  // Función para ordenar los ítems por fecha y luego por hora.
  // Devuelve un nuevo array ordenado.
  // Se utiliza en handleAddItem, handleEditItem y handleSaveEdit.
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

  // ***************************RENDERIZADO***************************
  return (
    <div className="container">
      {/* HEADER */}
      <h1>CRUD en Tiempo Real con Orden por Fecha y Hora</h1>

      {/* FORMULARIO */}
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

      {/* LISTA de ítems */}
      <ul className="items-grid">
        {/* CABECERAS */}
        <li className="items-header">
          <span>Fecha</span>
          <span>Hora</span>
          <span>Nombre</span>
          <span>Acciones</span>
        </li>
        {/* MAPEO */}
        {items.map(item => (
          // CONDICIONAL MODO MOSTRAR DATOS
          <li key={item.id} className="item">
            {/* MODO EDICION */}
            {editMode === item.id ? (
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
              // MODO LISTA
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

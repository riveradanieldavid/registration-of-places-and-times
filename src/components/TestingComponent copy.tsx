import React, { useState } from 'react';

interface Item {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [currentItem, setCurrentItem] = useState<Item>({ id: 0, name: "" });
  const [editMode, setEditMode] = useState<number | null>(null); // Para rastrear qué ítem está en modo de edición

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedItem = { ...currentItem, name: e.target.value };
    setCurrentItem(updatedItem);

    // Si el ítem ya está en la lista, actualiza su nombre en tiempo real
    setItems(prevItems =>
      prevItems.map(item => (item.id === currentItem.id ? updatedItem : item))
    );
  };

  const handleItemInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, name: e.target.value } : item
    );
    setItems(updatedItems);

    // Actualiza también el formulario en tiempo real
    const editedItem = updatedItems.find(item => item.id === id);
    if (editedItem) {
      setCurrentItem(editedItem);
    }
  };

  const handleAddItem = () => {
    if (currentItem.name.trim() === "") return;

    if (currentItem.id === 0) {
      // Agregar nuevo ítem
      setItems([...items, { ...currentItem, id: Date.now() }]);
    } else {
      // Actualizar el ítem existente
      setItems(prevItems =>
        prevItems.map(item => (item.id === currentItem.id ? currentItem : item))
      );
    }

    // Limpiar el formulario
    setCurrentItem({ id: 0, name: "" });
    setEditMode(null); // Salir del modo de edición
  };

  const handleEditItem = (item: Item) => {
    setCurrentItem(item);
    setEditMode(item.id); // Activa el modo de edición para este ítem
  };

  const handleDeleteItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    setEditMode(null); // Salir del modo de edición
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CRUD en Tiempo Real con Edición Inversa</h1>

      <input
        type="text"
        value={currentItem.name}
        onChange={handleInputChange}
        placeholder="Escribe el nombre..."
      />
      <button onClick={handleAddItem}>
        {currentItem.id === 0 ? "Agregar" : "Actualizar"}
      </button>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            {editMode === item.id ? (
              <input
                type="text"
                value={item.name}
                onChange={e => handleItemInputChange(e, item.id)}
              />
            ) : (
              item.name
            )}
            <button onClick={() => handleEditItem(item)}>Editar</button>
            <button onClick={() => handleDeleteItem(item.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import './App.css'; // Importar el archivo CSS general
import './styles.css'; // Importar el archivo CSS específico de Grid

function CrudApp() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    date: '',
    time: '',
    description: '',
    conductor: '',
    territory: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Cargar los datos del formulario desde localStorage al iniciar
  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem('formData'));
    if (savedFormData) {
      setFormData(savedFormData);
    }
    const savedData = JSON.parse(localStorage.getItem('data'));
    if (savedData) {
      setData(savedData);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    localStorage.setItem(
      'formData',
      JSON.stringify({ ...formData, [e.target.name]: e.target.value })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDate = formatDate(formData.date);
    let updatedData;
    if (isEditing) {
      updatedData = data.map((item) =>
        item.id === formData.id ? { ...formData, date: formattedDate } : item
      );
      setIsEditing(false);
    } else {
      updatedData = [
        ...data,
        { ...formData, id: Date.now(), date: formattedDate },
      ];
    }
    setData(updatedData);

    // Actualizar localStorage con el nuevo estado de los datos y el formulario
    localStorage.setItem('data', JSON.stringify(updatedData));
    localStorage.setItem('formData', JSON.stringify(formData));
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    const originalDate = revertDateFormat(itemToEdit.date);
    setFormData({ ...itemToEdit, date: originalDate });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
    localStorage.setItem('data', JSON.stringify(updatedData));
  };

  const formatDate = (date) => {
    const daysOfWeek = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const dateObj = new Date(date);
    const dayName = daysOfWeek[dateObj.getDay()];
    const day = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth() + 1;
    const year = dateObj.getUTCFullYear(); // Conservar el año original
    return `${dayName} ${day}/${month < 10 ? `0${month}` : month}/${year}`;
  };

  const revertDateFormat = (formattedDate) => {
    const [dayName, dayMonthYear] = formattedDate.split(' ');
    const [day, month, year] = dayMonthYear.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  return (
    <div className="crud-app-container">
      <h2 className="title">Salidas de predicación</h2>
      <form className="crud-form" onSubmit={handleSubmit}>
        <input
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
          name="description"
          placeholder="Punto de Encuentro"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="conductor"
          placeholder="Conductor"
          value={formData.conductor}
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
        <button type="submit">{isEditing ? 'Actualizar' : 'Agregar'}</button>
      </form>

      <div className="grid-container">
        <div className="grid-header">Día</div>
        <div className="grid-header">Hora</div>
        <div className="grid-header">Punto de Encuentro</div>
        <div className="grid-header">Conductor</div>
        <div className="grid-header">Territorio</div>
        <div className="grid-header">Acciones</div>

        {data.map((item) => (
          <React.Fragment key={item.id}>
            <div className="grid-item">{item.date}</div>
            <div className="grid-item">{item.time}</div>
            <div className="grid-item">{item.description}</div>
            <div className="grid-item">{item.conductor}</div>
            <div className="grid-item">{item.territory}</div>
            <div className="grid-item">
              <button onClick={() => handleEdit(item.id)}>Editar</button>
              <button onClick={() => handleDelete(item.id)}>Eliminar</button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default CrudApp;

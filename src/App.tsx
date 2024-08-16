import React, { useEffect, useState } from "react";
import "./App.css";
import "./styles.css";

// Función principal que define la aplicación CRUD
function CrudApp() {
    // ESTADOS
    // Estado para almacenar la lista de datos
    const [data, setData] = useState([]);
    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        id: null,
        date: "",
        time: "",
        place: "",
        servant: "",
        territory: "",
    });
    // Estado para manejar si estamos en modo edición
    const [isEditing, setIsEditing] = useState(false);
    // Estado para manejar la fila expandida en el modo móvil
    const [expandedRowId, setExpandedRowId] = useState(null);

    // useEffect para cargar los datos desde un archivo JSON cuando el componente se monta
    useEffect(() => {
        fetch("/data.json")
        .then((response) => response.json())
        .then((jsonData) => setData(jsonData))
        .catch((err) => console.error("Error loading JSON:", err));
    }, []);
    // FIN DEL useEffect

    // Función para manejar los cambios en el formulario
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        // Guardar los datos en el localStorage cada vez que se realiza un cambio en el formulario
        localStorage.setItem("formData", JSON.stringify({...formData, [e.target.name]: e.target.value}));
    };
    // FIN DE handleChange

    // Función para manejar el envío del formulario (Agregar o Actualizar)
    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedDate = formatDate(formData.date); // Formatear la fecha antes de guardarla
        const updatedData = isEditing
            ? data.map((item) => (item.id === formData.id ? {...formData, date: formattedDate} : item))
            : [...data, {...formData, id: Date.now(), date: formattedDate}];
        setData(updatedData);
        setIsEditing(false);
        // Guardar los datos en el localStorage después de agregar o actualizar
        localStorage.setItem("data", JSON.stringify(updatedData));
        localStorage.setItem("formData", JSON.stringify(formData));
    };
    // FIN DE handleSubmit

    // Función para manejar la edición de un ítem (establecer los datos en el formulario)
    const handleEdit = (id) => {
        const itemToEdit = data.find((item) => item.id === id);
        const originalDate = revertDateFormat(itemToEdit.date);
        setFormData({...itemToEdit, date: originalDate});
        setIsEditing(true);
    };
    // FIN DE handleEdit

    // Función para manejar la eliminación de un ítem de la lista
    const handleDelete = (id) => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        // Actualizar el localStorage después de eliminar un ítem
        localStorage.setItem("data", JSON.stringify(updatedData));
    };
    // FIN DE handleDelete

    // Función para manejar la expansión de una fila en el modo móvil
    const handleExpand = (id) => {
        setExpandedRowId(expandedRowId === id ? null : id); // Alternar entre expandir y contraer
    };
    // FIN DE handleExpand

    // Función para formatear la fecha en un formato amigable
    const formatDate = (date) => {
        const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const dateObj = new Date(date);
        const dayName = daysOfWeek[dateObj.getDay()];
        const day = dateObj.getUTCDate();
        const month = dateObj.getUTCMonth() + 1;
        const year = dateObj.getUTCFullYear();
        return `${dayName} ${day}/${month < 10 ? `0${month}` : month}/${year}`;
    };
    // FIN DE formatDate

    // Función para revertir el formato de fecha a un formato adecuado para el input date
    const revertDateFormat = (formattedDate) => {
        const [dayName, dayMonthYear] = formattedDate.split(" ");
        const [day, month, year] = dayMonthYear.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };
    // FIN DE revertDateFormat

    // Renderizado del componente CrudApp
    return (
        <div className="crud-app-container">
            <h2 className="title">Salidas de predicación</h2>
            <form className="crud-form" onSubmit={handleSubmit}>
                {/* Campos del formulario */}
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                <input
                    type="text"
                    name="place"
                    placeholder="Lugar"
                    value={formData.place}
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
                <button type="submit">{isEditing ? "Actualizar" : "Agregar"}</button>
            </form>

            {/* Contenedor de la cuadrícula de datos */}

            {/* CABECERAS */}
            <div className="grid-container">
                <div className="grid-header">Día</div>
                <div className="grid-header">Hora</div>
                <div className="grid-header">Lugar</div>
                <div className="grid-header2 grid-header">Conductor</div>
                <div className="grid-header2 grid-header">Territorio</div>
                <div className="grid-header2 grid-header">Acciones</div>

                {/* ITEMS DATOS */}
                {data.map((item) => (
                    <React.Fragment key={item.id}>
                        <div className="grid-item">
                            {item.date}
                            <span className="plus-icon" onClick={() => handleExpand(item.id)}>
                                +
                            </span>
                        </div>
                        <div className="grid-item">{item.time}</div>
                        <div className="grid-item">{item.place}</div>
                        <div className="grid-item2 grid-item ">{item.servant}</div>
                        <div className="grid-item2 grid-item ">{item.territory}</div>
                        <div className="grid-item2 grid-item ">
                            <button onClick={() => handleEdit(item.id)}>Editar</button>
                            <button onClick={() => handleDelete(item.id)}>Borrar</button>
                        </div>

                        {/* Información expandida para modo móvil */}
                        {expandedRowId === item.id && (
                            <div className="expanded-info">
                                <div className="grid-header expand-title">Conductor</div>
                                <div className="grid-item expand-content">{item.servant}</div>
                                <div className="grid-header expand-title">Territorio</div>
                                <div className="grid-item expand-content">{item.territory}</div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default CrudApp;
// FIN DE CrudApp

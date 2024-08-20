import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./App.css";
import "./styles.css";

interface FormData {
    id: number | null;
    date: string;
    time: string;
    place: string;
    servant: string;
    territory: string;
}

interface DataItem extends FormData {
    id: number;
}

function CrudApp() {
    const [data, setData] = useState<DataItem[]>([]);
    const [formData, setFormData] = useState<FormData>({
        id: null,
        date: "",
        time: "",
        place: "",
        servant: "",
        territory: "",
    });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    const today = new Date()
    .toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
    .replace(",", "")
    .trim();

    useEffect(() => {
        fetch("/registration-of-places-and-times/data.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then((jsonData) => {
            console.log("Datos cargados:", jsonData);
            setData(jsonData);
        })
        .catch((err) => {
            console.error("Error loading JSON:", err.message);
        });
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        localStorage.setItem("formData", JSON.stringify({...formData, [e.target.name]: e.target.value}));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formattedDate = formatDate(formData.date);
        const formattedTime = formatTime(formData.time);

        const updatedData = isEditing
            ? data.map((item) =>
                  item.id === formData.id ? {...formData, id: item.id, date: formattedDate, time: formattedTime} : item
              )
            : [...data, {...formData, id: Date.now(), date: formattedDate, time: formattedTime}];

        setData(updatedData);
        setIsEditing(false);
        localStorage.setItem("data", JSON.stringify(updatedData));
        localStorage.setItem("formData", JSON.stringify(formData));
    };

    const handleEdit = (id: number) => {
        const itemToEdit = data.find((item) => item.id === id);
        if (itemToEdit) {
            const originalDate = revertDateFormat(itemToEdit.date);
            const originalTime = revertTimeFormat(itemToEdit.time);
            setFormData({...itemToEdit, date: originalDate, time: originalTime});
            setIsEditing(true);
        }
    };

    const handleDelete = (id: number) => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        localStorage.setItem("data", JSON.stringify(updatedData));
    };

    const handleExpand = (id: number) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    const formatDate = (date: string) => {
        const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const dateObj = new Date(date);
        const dayName = daysOfWeek[dateObj.getDay()];
        const day = dateObj.getUTCDate();
        const month = dateObj.getUTCMonth() + 1;
        const year = dateObj.getUTCFullYear();
        return `${dayName} ${day}/${month < 10 ? `0${month}` : month}/${year}`;
    };

    const revertDateFormat = (formattedDate: string) => {
        const [dayMonthYear] = formattedDate.split(" ");
        const [day, month, year] = dayMonthYear.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };

    const formatTime = (time: string) => {
        return time;
    };

    const revertTimeFormat = (formattedTime: string) => {
        return formattedTime;
    };

    return (
        <div className="crud-app-container">
            <h2 className="title">Salidas de predicación</h2>
            <form className="crud-form" onSubmit={handleSubmit}>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                <input
                    type="text"
                    name="place"
                    placeholder="Punto de encuentro"
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

            <div className="grid-container">
                <div className="grid-header">Día</div>
                <div className="grid-header">Hora</div>
                <div className="grid-header">Lugar</div>
                <div className="grid-header2 grid-header">Conductor</div>
                <div className="grid-header2 grid-header">Territorio</div>
                <div className="grid-header2 grid-header">Acciones</div>
                {data.map((item) => (
                    <React.Fragment key={item.id}>
                        <div
                            className={`grid-item ${item.date.trim() === today ? "highlight" : ""} ${
                                expandedRowId === item.id ? "selected-row" : ""
                            }`}
                        >
                            {item.date}
                        </div>
                        <div
                            className={`grid-item ${item.date.trim() === today ? "highlight" : ""} ${
                                expandedRowId === item.id ? "selected-row" : ""
                            }`}
                        >
                            {formatTime(item.time)}
                            <span className="plus-icon" onClick={() => handleExpand(item.id)}>
                                {expandedRowId === item.id ? "-" : "+"}
                            </span>
                        </div>
                        <div
                            className={`grid-item ${item.date.trim() === today ? "highlight" : ""} ${
                                expandedRowId === item.id ? "selected-row" : ""
                            }`}
                        >
                            {item.place}
                        </div>
                        <div className={`grid-item2 grid-item ${expandedRowId === item.id ? "selected-row" : ""}`}>
                            {item.servant}
                        </div>
                        <div className={`grid-item2 grid-item ${expandedRowId === item.id ? "selected-row" : ""}`}>
                            {item.territory}
                        </div>
                        <div className={`grid-item2 grid-item ${expandedRowId === item.id ? "selected-row" : ""}`}>
                            <button onClick={() => handleEdit(item.id)}>Editar</button>
                            <button onClick={() => handleDelete(item.id)}>Eliminar</button>
                        </div>

                        {expandedRowId === item.id && (
                            <div className="expanded-info selected-row">
                                <div className="grid-header expand-title selected-row">Conductor</div>
                                <div className="grid-item expand-content selected-row">{item.servant}</div>
                                <div className="grid-header expand-title selected-row">Territorio</div>
                                <div className="grid-item expand-content selected-row">{item.territory}</div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default CrudApp;

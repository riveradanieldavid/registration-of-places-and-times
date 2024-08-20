import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./App.css";
import { DataItem, FormData } from "./interfaces";
import "./styles.css";
import {
    createGoogleMapsLink,
    extractStreets,
    formatDate,
    formatTime,
    revertDateFormat,
    revertTimeFormat,
} from "./utils";

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
  const [message, setMessage] = useState("");

  const todaytiny = new Date()
    .toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(",", "")
    .trim();
  const today = todaytiny.charAt(0).toUpperCase() + todaytiny.slice(1).toLowerCase();

  useEffect(() => {
    fetch("/registration-of-places-and-times/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((err) => {
        console.error("Error loading JSON:", err.message);
      });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    localStorage.setItem(
      "formData",
      JSON.stringify({ ...formData, [e.target.name]: e.target.value })
    );
  };

  const showMessage = (type: string) => {
    const messages = {
      updated: "Item actualizado...",
      added: "Item agregado...",
    };

    setMessage(messages[type]);

    setTimeout(() => {
      setMessage("");
    }, 6000);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedDate = formatDate(formData.date);
    const formattedTime = formatTime(formData.time);

    const googleMapsLink = createGoogleMapsLink(formData.place);

    const updatedData = isEditing
      ? data.map((item) =>
          item.id === formData.id
            ? {
                ...formData,
                id: item.id,
                date: formattedDate,
                time: formattedTime,
                place: formData.place,
                placeLink: googleMapsLink,
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
            placeLink: googleMapsLink,
          },
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
  };

  const handleEdit = (id: number) => {
    const itemToEdit = data.find((item) => item.id === id);
    if (itemToEdit) {
      const originalDate = revertDateFormat(itemToEdit.date);
      const originalTime = revertTimeFormat(itemToEdit.time);
      setFormData({
        ...itemToEdit,
        date: originalDate,
        time: originalTime,
        place: extractStreets(itemToEdit.place),
      });
      setIsEditing(true);
    }
  };

  const handleDelete = (id: number) => {
    const itemToDelete = data.find((item) => item.id === id);

    if (itemToDelete) {
      const confirmDelete = window.confirm(
        `Eliminar fecha ${itemToDelete.date} en ${itemToDelete.place}?`
      );

      if (confirmDelete) {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        localStorage.setItem("data", JSON.stringify(updatedData));
      }
    }
  };

  const handleExpand = (id: number) => {
    setExpandedRowId(expandedRowId === id ? null : id);
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
        {message && <span className="message show">{message}</span>}
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
              className={`grid-item ${
                item.date.trim() === today ? "highlight" : ""
              } ${expandedRowId === item.id ? "selected-row" : ""}`}
            >
              {item.date}
            </div>
            <div
              className={`grid-item ${
                item.date.trim() === today ? "highlight" : ""
              } ${expandedRowId === item.id ? "selected-row" : ""}`}
            >
              {formatTime(item.time)}
              <span className="plus-icon" onClick={() => handleExpand(item.id)}>
                {expandedRowId === item.id ? "-" : "+"}
              </span>
            </div>
            <div
              className={`grid-item ${
                item.date.trim() === today ? "highlight" : ""
              } ${expandedRowId === item.id ? "selected-row" : ""}`}
            >
              <a href={item.placeLink} target="_blank" rel="noopener noreferrer">
                {item.place}
              </a>
            </div>
            {expandedRowId === item.id && (
              <>
                <div className="grid-item selected-row">{item.servant}</div>
                <div className="grid-item selected-row">{item.territory}</div>
                <div className="grid-item selected-row">
                  <button onClick={() => handleEdit(item.id)}>Editar</button>
                  <button onClick={() => handleDelete(item.id)}>Eliminar</button>
                </div>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default CrudApp;

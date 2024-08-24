// Importaciones
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./App.css";
import territoryImageFull from "./assets/territoryImage.jpg";
import territoryImagePhone from "./assets/territoryImagePhone.jpg";
import "./styles.css";

// INTERFACES
// Definición de la interfaz para los datos del formulario
interface FormData {
  id: number | null;
  date: string;
  time: string;
  place: string; // Dirección ingresada por el usuario
  servant: string;
  territory: string;
}

// Definición de la interfaz para los ítems de datos
interface DataItem extends FormData {
  id: number;
  placeLink: string; // Enlace generado a Google Maps
}

// FUNCIONES PRINCIPALES
// Función principal del componente CrudApp
function CrudApp() {
  // ESTADOS
  // Estado para almacenar los datos
  const [data, setData] = useState<DataItem[]>([]);
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState<FormData>({
    id: null,
    date: "",
    time: "",
    place: "",
    servant: "",
    territory: ""
  });
  // Estado para determinar si está en modo edición
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Estado para manejar la fila expandida
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  // Estado para mostrar mensajes
  const [message, setMessage] = useState("");
  // Estado para la fuente de imagen
  const [imageSrc, setImageSrc] = useState(territoryImageFull);
  // Estado para manejar el tamaño de pantalla
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1200);

  // VARIABLES Y FUNCIONES AUXILIARES
  // Obtener la fecha actual formateada
  const todaytiny = new Date()
    .toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replace(",", "")
    .trim();
  const today =
    todaytiny.charAt(0).toUpperCase() + todaytiny.slice(1).toLowerCase();

  console.log(today);

  // EFECTOS SECUNDARIOS
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
      .then(jsonData => {
        console.log("Datos cargados:", jsonData);
        setData(jsonData);
      })
      .catch(err => {
        console.error("Error loading JSON:", err.message);
      });
  }, []);

  // CONDICIONAL IMAGES PHONE OR DESKTOP
  //   CONDICIONAL ZOOM SOLO EN 1200PX O MAS
  // Efecto para manejar el cambio de imagen y tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 700) {
        setImageSrc(territoryImagePhone);
      } else {
        setImageSrc(territoryImageFull);
      }
      setIsLargeScreen(window.innerWidth >= 1200);
    };
    // Set the initial image and screen size based on the current window width
    handleResize();
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // MANEJADORES DE EVENTOS
  // Manejar cambios en el formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    localStorage.setItem(
      "formData",

      // Función para extraer solo las calles ingresadas
      JSON.stringify({ ...formData, [e.target.name]: e.target.value })
    );
  };

  // Función para extraer solo las calles ingresadas
  const extractStreets = (place: string): string => {
    console.log("Entrada a extractStreets:", place);
    try {
      const url = new URL(place);
      const query = url.searchParams.get("query");
      console.log("Calles extraídas:", query);
      return query || "No se encontró información";
    } catch (error) {
      console.error("Error al extraer calles:", error);
      return place;
    }
  };

  // Función para crear el enlace de Google Maps
  const createGoogleMapsLink = (place: string) => {
    const formattedPlace = encodeURIComponent(place);
    return `https://www.google.com/maps/search/?api=1&query=${formattedPlace}+, San Miguel, Buenos Aires, Argentina`;
  };

  // Función para mostrar mensajes de acción
  const showMessage = (type: string) => {
    const messages: { [key: string]: string } = {
      updated: "Actualizando Item...",
      added: "Agregando Item..."
    };
    setMessage(messages[type]);
    setTimeout(() => {
      setMessage("");
    }, 700);
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

    // Aquí iría el código para agregar o actualizar el item...
  };

  // Función para manejar la edición de un ítem
  const handleEdit = (id: number) => {
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

      if (confirmDelete) {
        const updatedData = data.filter(item => item.id !== id);
        setData(updatedData);
        localStorage.setItem("data", JSON.stringify(updatedData));
      }
    }
  };

  // Función para manejar la expansión de una fila
  const handleExpand = (id: number) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  // Función para formatear la fecha
  const formatDate = (date: string) => {
    try {
      const daysOfWeek = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo"
      ];
      const dateObj = new Date(date);
      const dayName = daysOfWeek[dateObj.getDay()];
      const day = dateObj.getUTCDate();
      const month = dateObj.getUTCMonth() + 1;
      const year = dateObj.getUTCFullYear();

      // Verifica el nombre del día, el día, el mes y el año
      console.log("Nombre del día:", dayName);
      console.log("Día:", day);
      console.log("Mes:", month);
      console.log("Año:", year);

      // Capitalizar el primer carácter del nombre del día
      const capitalizedDayName =
        dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();
      console.log("Nombre del día capitalizado:", capitalizedDayName);

      // Función para formatear la hora
      const formattedDate = `${capitalizedDayName} ${day
        .toString()
        .padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
      console.log("Fecha formateada:", formattedDate);

      return formattedDate;
    } catch (error) {
      console.error("Error en formatDate:", error);
      return date; // Devolver la fecha original en caso de error
    }
  };

  // Función para revertir el formato de la hora
  const revertDateFormat = (formattedDate: string) => {
    const [, dayMonthYear] = formattedDate.split(" ");
    const [day, month, year] = dayMonthYear.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // Función para formatear la hora
  const formatTime = (time: string) => {
    return time;
  };

  const revertTimeFormat = (formattedTime: string) => {
    return formattedTime;
  };

  // zoom image
  const moveZoom = (event: React.MouseEvent<HTMLDivElement>) => {
    const zoomArea = document.querySelector(".zoom-area") as HTMLElement;
    const imageFull = document.querySelector(".imageFull") as HTMLElement;
    const contenedor = document.querySelector(
      ".territoryImageFull"
    ) as HTMLElement;

    const contenedorRect = contenedor.getBoundingClientRect();
    const x = event.clientX - contenedorRect.left - zoomArea.offsetWidth / 2;
    const y = event.clientY - contenedorRect.top - zoomArea.offsetHeight / 2;

    // Mover el zoom-area
    zoomArea.style.left =
      Math.max(0, Math.min(contenedorRect.width - zoomArea.offsetWidth, x)) +
      "px";
    zoomArea.style.top =
      Math.max(0, Math.min(contenedorRect.height - zoomArea.offsetHeight, y)) +
      "px";

    // Calcular el porcentaje de la posición del mouse
    const percentX = (x / contenedorRect.width) * 100;
    const percentY = (y / contenedorRect.height) * 100;

    // Aplicar el zoom y mover la imagen en consecuencia
    imageFull.style.transformOrigin = `${percentX}% ${percentY}%`;
    imageFull.style.transform = "scale(2)";
  };

  const handleMouseOut = () => {
    const imageFull = document.querySelector(".imageFull") as HTMLElement;
    imageFull.style.transform = "scale(1)";
  };

  return (
    <div className="crud-app-container">
      <h2 className="title">Salidas de predicación</h2>

      <div
        className="territoryImageFull"
        onMouseMove={isLargeScreen ? moveZoom : undefined} // Solo activar en pantallas grandes
        onMouseOut={isLargeScreen ? handleMouseOut : undefined} // Solo activar en pantallas grandes
      >
        <div className="zoom">
          <img
            className="imageFull"
            src={imageSrc} // Muestra la imagen seleccionada
            alt="Territorio de predicación"
          />
        </div>
        <div className="zoom-area"></div>
      </div>

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
          className={`submit-button ${message ? "hidden" : ""}`}
        >
          {isEditing ? "Actualizar" : "Agregar"}
        </button>
        <span className={`message ${message ? "show" : "hidden"}`}>
          {message}
        </span>
      </form>
      <div className="grid-container">
        <div className="grid-header">Día</div>
        <div className="grid-header">Hora</div>
        <div className="grid-header">Lugar</div>
        <div className="grid-header2 grid-header">Conductor</div>
        <div className="grid-header2 grid-header">Territorio</div>
        <div className="grid-header2 grid-header">Acciones</div>
        {data.map(item => {
          // Console log para depuración
          console.log("Item actual:", item);

          return (
            <React.Fragment key={item.id}>
              <div
                className={`grid-item ${
                  item.date.trim() === today ? "highlight" : "" // DIA
                } ${expandedRowId === item.id ? "selected-row" : ""}`}
              >
                {item.date}
                {item.date.trim() === today ? <h3>HOY</h3> : ""}
              </div>
              <div
                className={`grid-item ${
                  item.date.trim() === today ? "highlight" : "" // HORA
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
              <div
                className={`grid-item ${
                  item.date.trim() === today ? "highlight" : "" // PUNTO DE ENCUENTRO
                } ${expandedRowId === item.id ? "selected-row" : ""}`}
              >
                {/* Aquí renderizas solo las calles */}
                {extractStreets(item.place)}

                {/* Aquí renderizas el enlace con la leyenda */}
                <br />
                <a
                  href={item.placeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver ubicación
                </a>
              </div>
              <div
                className={`grid-item2 grid-item ${
                  item.date.trim() === today ? "highlight" : "" // CONDUCTOR
                } ${expandedRowId === item.id ? "selected-row" : ""}`}
              >
                {item.servant}
              </div>
              <div
                className={`grid-item2 grid-item ${
                  item.date.trim() === today ? "highlight" : "" // TERRITORIO
                } ${expandedRowId === item.id ? "selected-row" : ""}`}
              >
                {item.territory}
              </div>
              <div
                className={`buttons-edit grid-item2 grid-item ${
                  item.date.trim() === today ? "highlight" : "" // ACCIONES
                } ${expandedRowId === item.id ? "selected-row" : ""}`}
              >
                <button onClick={() => handleEdit(item.id)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </div>

              {/* EXPANDED INFO */}
              {expandedRowId === item.id && (
                <div
                  className={`expanded-info selected-row ${
                    item.date.trim() === today ? "highlight" : ""
                  }`}
                >
                  {/* CONDUCTOR */}
                  <div
                    className={`grid-header-expanded grid-header ${
                      item.date.trim() === today ? "highlight" : ""
                    }`}
                  >
                    Conductor
                  </div>
                  <div
                    className={`grid-item expand-content selected-row grid-header ${
                      item.date.trim() === today ? "highlight" : ""
                    }`}
                  >
                    {item.servant}
                  </div>
                  {/* TERRITORIO */}
                  <div
                    className={`grid-header-expanded grid-header ${
                      item.date.trim() === today ? "highlight" : ""
                    }`}
                  >
                    Territorio
                  </div>
                  <div
                    className={`grid-item expand-content selected-row grid-header ${
                      item.date.trim() === today ? "highlight" : ""
                    }`}
                  >
                    {item.territory}
                  </div>
                  {/* EXPANDED INFO */}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default CrudApp;

import React, { useEffect, useState } from "react";

import territoryImageFull from "../assets/territoryImage.jpg";
import territoryImagePhone from "../assets/territoryImagePhone.jpg";

const HeaderComponent = () => {
  // Estado para la fuente de imagen
  const [imageSrc, setImageSrc] = useState(territoryImageFull);
  // Estado para manejar el tamaño de pantalla
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1200);

  // Efecto para manejar el cambio de imagen y tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 860) {
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
    <div className="header">
      {/* HEADER */}
      <h1 className="title">Salidas de predicación</h1>
      {/* IMAGEN HEADER */}
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
    </div>
  );
};

export default HeaderComponent;

/* 
import { useEffect, useState } from "react";
import territoryImageFull from "./assets/territoryImage.jpg";
import territoryImagePhone from "./assets/territoryImagePhone.jpg";
const ImageComponent = () => {
    const [imageSrc, setImageSrc] = useState(territoryImageFull);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 700) {
                setImageSrc(territoryImagePhone);
            } else {
                setImageSrc(territoryImageFull);
            }
        };

        // Set the initial image based on the current window width
        handleResize();

        // Add event listener for window resize
        window.addEventListener("resize", handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="territoryImageFull">
            <div className="zoom">
                <img
                    width={400}
                    className="imageFull"
                    src={imageSrc} // Muestra la imagen seleccionada
                    alt="Territorio de predicación"
                />
            </div>
            <div className="zoom-area"></div>
        </div>
    );
};

export default ImageComponent;
 */

import { useState } from "react";

// Hook personalizado para mostrar y actualizar mensajes
export const useMessage = () => {
    // Estado para el mensaje actual
    const [message, setMessage] = useState("");
    // Función para mostrar mensajes de acuerdo a un tipo específico
    const showMessage = (type: string) => {
        const messages: { [key: string]: string } = {
            updated: "ITEM ACTUALIZADO",
            added: "DUPLICADO AGREGADO"
        };
        // Actualiza el mensaje basado en el tipo
        setMessage(messages[type] || "");

        // Opción para limpiar el mensaje después de cierto tiempo
        // setTimeout(() => {
        // setMessage(""); // Limpia el mensaje después de 7 segundos (ajustable)
        // }, 7000);
    };
    // Retorna tanto el mensaje como la función para mostrarlo
    return { message, showMessage };
};





/* 
// Estado para mostrar mensajes
export const [message, setMessage] = useState("");
// Función para mostrar mensajes de acción de edición
export const showMessage = (type: string) => {
    const messages: { [key: string]: string } = {
        updated: "ITEM ACTUALIZADO",
        added: "ITEM DUPLICADO."
    };
    setMessage(messages[type]);
    // setTimeout(() => {
    //   setMessage('')
    // }, 70000)
};
 */
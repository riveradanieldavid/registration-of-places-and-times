import { useEffect, RefObject } from "react";

// Función que maneja el efecto de cargar los datos
export const useFetchData = (setData: React.Dispatch<React.SetStateAction<any>>) => {
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
                setData(jsonData); // Llama a setData para actualizar el estado en el componente original
            })
            .catch(err => {
                console.error("Error loading JSON:", err.message);
            });
    }, []); // El array vacío [] asegura que solo se ejecute una vez
};

// Función que maneja el evento de clic fuera del formulario
export const useClickOutsideToClose = (
    formRef: React.RefObject<HTMLFormElement>,
    buttonRef: React.RefObject<HTMLButtonElement>,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
    showMessage: React.Dispatch<React.SetStateAction<string>>
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Comprobar si el clic fue fuera del formulario y del botón "Editar"
            if (
                (formRef.current && !formRef.current.contains(event.target as Node)) ||
                (buttonRef.current && !buttonRef.current.contains(event.target as Node))
            ) {
                setIsEditing(false);
                showMessage("");
            }
        };
        // Añadir el listener al documento
        document.addEventListener("click", handleClickOutside);
        // Eliminar el listener cuando el componente se desmonte
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [formRef, buttonRef]);
};


// Hook para autoenfocar el input cuando está en modo de edición
export const useAutoFocus = (
    inputRef: RefObject<HTMLInputElement>,
    isEditing: boolean
) => {
    useEffect(() => {
        // Enfocar el input cuando se esté editando
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing, inputRef]); // Dependencias: cambiará cuando isEditing o inputRef cambie
};





/* 
export const AutoFocus = (
    inputRef: RefObject<HTMLInputElement>,
    isEditing: React.Dispatch<React.SetStateAction<boolean>>,
    editingItemId: React.Dispatch<React.SetStateAction<number>>

) => {
    useEffect(() => {
        // Enfocar el input cuando se esté editando
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingItemId]);
};

// Focus en formulario siempre
const inputRef = useRef<HTMLInputElement | null>(null);
useEffect(() => {
    // Enfocar el input cuando se esté editando
    if (isEditing && inputRef.current) {
        inputRef.current.focus();
    }
}, [editingItemId]);
 */
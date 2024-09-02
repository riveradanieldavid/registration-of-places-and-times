import { RefObject } from 'react';

export interface DataItem {
    id: number;
    date: string;
    time: string;
    place: string;
    servant: string;
    territory: string;
    placeLink?: string; // El enlace a Google Maps puede ser opcional
}

export interface FormData {
    id: number | null;
    date: string;
    time: string;
    place: string;
    servant: string;
    territory: string;
}

export interface DatesComponentProps {
    data: DataItem[];
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
    isEditing: boolean;
    editingItemId: number | null;
    formRef: RefObject<HTMLFormElement>; // Añade formRef aquí
}

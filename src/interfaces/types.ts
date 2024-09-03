export interface DataItem {
    id: number;
    date: string;
    time: string;
    place: string;
    placeLink: string;
    servant: string;
    territory: string;
}

export interface DatesComponentProps {
    data: DataItem[];
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleEdit: (id: number) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDelete: (id: number) => void;
    isEditing: boolean;
    editingItemId: number | null;
    message: string;
    formRef: React.RefObject<HTMLFormElement>;
    buttonRef: React.RefObject<HTMLButtonElement>;
}

export interface FormData {
    id: number;
    date: string;
    time: string;
    place: string;
    servant: string;
    territory: string;
}

export interface Item {
    id: number;   // Identificador único del ítem.
    name: string; // Nombre o descripción del ítem.
    date: string; // Fecha asociada al ítem.
    time: string; // Hora asociada al ítem.
    servant: string;
    territory: string;
}
export interface ExpandedComponentProps {
    expandedRowId: number;  // Tipo de dato depende de cómo manejas los IDs
    item: Item;                      // Objeto que representa la fila expandida
    today: string;                   // Fecha de hoy, tipada como string
}

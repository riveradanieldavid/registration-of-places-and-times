export interface FormData {
    id: number | null;
    date: string;
    time: string;
    place: string;
    servant: string;
    territory: string;
}

export interface DataItem extends FormData {
    id: number;
    placeLink: string;
}

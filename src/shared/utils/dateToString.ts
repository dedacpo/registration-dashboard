import { format } from "date-fns/fp";

export const dateToString = (date: Date): string => {
    return format("dd/MM/yyyy", date);
}
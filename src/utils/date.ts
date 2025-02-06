import { format as dateFnsFormat } from "date-fns";
import { nb } from "date-fns/locale";

export const formatNorwegianDate = (date?: string | Date, format = "PPP") => {
  if (!date) return "Ukjent dato";
  return dateFnsFormat(new Date(date), format, { locale: nb });
};

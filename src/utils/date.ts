import dateFnsFormat from "date-fns/format";
import nb from "date-fns/locale/nb";

export const formatNorwegianDate = (date?: string | Date, format = "PPP") => {
  if (!date) return "Ukjent dato";
  return dateFnsFormat(new Date(date), format, { locale: nb });
};

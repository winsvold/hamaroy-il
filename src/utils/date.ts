import { intervalToDuration } from "date-fns";
import { nb } from "date-fns/locale";
import { sift } from "radash";
import { formatInTimeZone } from "date-fns-tz";

export const formatNorwegianDate = (
  date?: string | Date | null,
  format = "PPP",
) => {
  if (!date) return "Ukjent dato";
  return formatInTimeZone(new Date(date), "Europe/Oslo", format, {
    locale: nb,
  });
};

/** Stor forbokstav bare på første ord, som i «Mandag 22. januar» */
export const formatNorwegianDateCapitalized = (
  date?: string | Date | null,
  format?: string,
) => {
  const formatted = formatNorwegianDate(date, format);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/** Samme kalenderdag i norsk tid */
export const isSameNorwegianDay = (a: string | Date, b: string | Date) =>
  formatNorwegianDate(a, "yyyy-MM-dd") === formatNorwegianDate(b, "yyyy-MM-dd");

/** «09:00 – 15:00», eller «09:00 – søn 15:00» når den slutter en annen dag */
export const formatNorwegianTimeRange = (
  from?: string | Date | null,
  to?: string | Date | null,
) => {
  if (!from || !to) return formatNorwegianDate(from, "p");
  const end = isSameNorwegianDay(from, to)
    ? formatNorwegianDate(to, "p")
    : formatNorwegianDate(to, "EEE p");
  return `${formatNorwegianDate(from, "p")} – ${end}`;
};

export const formatNorwegianDuration = (from?: string, to?: string) => {
  if (!from || !to) return "Ukjent varighet";
  const duration = intervalToDuration({
    start: new Date(from),
    end: new Date(to),
  });
  return sift([
    duration.hours && `${duration.hours}t`,
    duration.minutes && `${duration.minutes}m`,
  ]).join(" ");
};

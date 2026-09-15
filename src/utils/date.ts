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

/**
 * Stor forbokstav på første ord — resten står som date-fns gir det. Norske måneds- og
 * ukedagsnavn skrives med liten bokstav, så CSS `capitalize` ville gitt «22. Januar».
 */
export const formatNorwegianDateCapitalized = (
  date?: string | Date | null,
  format?: string,
) => {
  const formatted = formatNorwegianDate(date, format);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/** Samme kalenderdag i norsk tid, ikke i UTC — der havner en aktivitet 00:30 på dagen før. */
export const isSameNorwegianDay = (a: string | Date, b: string | Date) =>
  formatNorwegianDate(a, "yyyy-MM-dd") === formatNorwegianDate(b, "yyyy-MM-dd");

/**
 * «09:00 – 15:00». Slutter aktiviteten en annen dag, får sluttiden ukedagen foran seg:
 * «09:00 – søn 15:00». Uten den leses et todagerskurs som et kurs på seks timer.
 */
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

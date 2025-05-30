import { intervalToDuration } from "date-fns";
import { nb } from "date-fns/locale";
import { sift } from "radash";
import { formatInTimeZone } from "date-fns-tz";

export const formatNorwegianDate = (date?: string | Date, format = "PPP") => {
  if (!date) return "Ukjent dato";
  return formatInTimeZone(new Date(date), "Europe/Oslo", format, {
    locale: nb,
  });
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
  ]);
};

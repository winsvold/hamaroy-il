/** Sluttiden finnes ikke i dataene, og regnes ut fra starten og varigheten */
export const sessionTimes = `
  "startsAt": dateTime(startsAt),
  "endsAt": dateTime(startsAt) + coalesce(duration.hours, 0) * 60 * 60 + coalesce(duration.minutes, 0) * 60,
`;

/** Bare sesjoner som ikke er ferdige ennå, med den første først */
export const upcomingFirst = `[defined(startsAt) && dateTime(endsAt) > dateTime(now())] | order(startsAt asc)`;

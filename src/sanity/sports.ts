/**
 * Idrettene i Hamarøy IL. Definert i kode framfor som dokumenttype fordi lista er kort
 * og stabil.
 *
 * Brukes tre steder:
 *  - `sport`-feltet på «sessionSeries» og «event» (options.list)
 *  - gruppering og ankere på /faste-aktiviteter
 *  - kategorimerkelappen øverst på en aktivitetsside
 *
 * Emojien er bevisst bare et redaktørhjelpemiddel — den vises i nedtrekkslista og på
 * forhåndsvisningene i Sanity, aldri på nettsidene. Nordlys-designet bruker ingen emoji.
 */

export type Sport = {
  id: string;
  title: string;
  /** Kun til Sanity Studio. Skal ikke rendres på nettsidene. */
  emoji: string;
};

export const sports = [
  { id: "fotball", title: "Fotball", emoji: "⚽" },
  { id: "klatring", title: "Klatring", emoji: "🧗" },
  { id: "handball", title: "Håndball", emoji: "🤾" },
  { id: "turn", title: "Turn & gym", emoji: "🤸" },
  { id: "innebandy", title: "Innebandy", emoji: "🏐" },
  { id: "allidrett", title: "Allidrett barn", emoji: "🧒" },
] as const satisfies readonly Sport[];

export type SportId = (typeof sports)[number]["id"];

/** Til `options.list` i Sanity-skjemaene */
export const sportOptions = sports.map((sport) => ({
  title: `${sport.emoji} ${sport.title}`,
  value: sport.id,
}));

export const getSport = (id?: string | null): Sport | undefined =>
  sports.find((sport) => sport.id === id);

/**
 * Nøkkelord som gjetter idrett ut fra tittelen. Dette er kun en fallback for innhold som
 * ble laget før `sport`-feltet fantes — settes feltet eksplisitt, vinner det alltid.
 * Kan fjernes når alt innhold er merket.
 */
const titleKeywords: [RegExp, SportId][] = [
  [/fotball/i, "fotball"],
  [/klatr/i, "klatring"],
  [/h[åa]ndball/i, "handball"],
  [/innebandy/i, "innebandy"],
  [/turn|gym/i, "turn"],
  [/allidrett/i, "allidrett"],
];

export const inferSportFromTitle = (
  title?: string | null,
): Sport | undefined => {
  if (!title) return undefined;
  const match = titleKeywords.find(([pattern]) => pattern.test(title));
  return match && getSport(match[1]);
};

/** Eksplisitt `sport`-felt hvis satt, ellers gjett ut fra tittelen. */
export const resolveSport = (item?: {
  sport?: string | null;
  title?: string | null;
}): Sport | undefined =>
  getSport(item?.sport) ?? inferSportFromTitle(item?.title);

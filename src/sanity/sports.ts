/**
 * Idrettene i Hamarøy IL. Definert i kode framfor som dokumenttype fordi lista er kort,
 * stabil og trenger både emoji og farge som uansett hører hjemme i designsystemet.
 *
 * Brukes tre steder:
 *  - `sport`-feltet på «sessionSeries» og «event» (options.list)
 *  - gruppering og ankere på /faste-aktiviteter
 *  - «Våre grupper»-flisene på forsiden
 */

/** Fargene flisene og kategorimerkene roterer gjennom. Peker på tokens i provider.tsx */
export type SportAccent =
  | "forest"
  | "amber"
  | "terracotta"
  | "moss"
  | "tint"
  | "mist";

export type Sport = {
  id: string;
  title: string;
  emoji: string;
  accent: SportAccent;
  /** Kort beskrivelse som vises på «Våre grupper»-flisene på forsiden */
  description: string;
};

export const sports = [
  {
    id: "fotball",
    title: "Fotball",
    emoji: "⚽",
    accent: "forest",
    description: "Barne- og ungdomsfotball, herrer og damer senior.",
  },
  {
    id: "klatring",
    title: "Klatring",
    emoji: "🧗",
    accent: "amber",
    description: "Klatrevegg i Hamarøyhallen, faste kvelder for alle nivåer.",
  },
  {
    id: "handball",
    title: "Håndball",
    emoji: "🤾",
    accent: "terracotta",
    description: "Ungdoms- og voksentrening i Hamarøyhallen.",
  },
  {
    id: "turn",
    title: "Turn & gym",
    emoji: "🤸",
    accent: "moss",
    description: "Turnglede for barn, gymgrupper for voksne.",
  },
  {
    id: "innebandy",
    title: "Innebandy",
    emoji: "🏐",
    accent: "tint",
    description: "Sesongbasert trening og seriespill for ungdom.",
  },
  {
    id: "allidrett",
    title: "Allidrett barn",
    emoji: "🧒",
    accent: "mist",
    description: "Variert idrettsglede for de yngste, 4–8 år.",
  },
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

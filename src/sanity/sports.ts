/** Idrettene i laget. Emojien vises bare i Sanity Studio, ikke på nettsidene. */

type Sport = {
  id: string;
  title: string;
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

type SportId = (typeof sports)[number]["id"];

export const sportOptions = sports.map((sport) => ({
  title: `${sport.emoji} ${sport.title}`,
  value: sport.id,
}));

/** Gjetter idrett ut fra tittelen, for innhold uten `sport`-felt */
const titleKeywords: [RegExp, SportId][] = [
  [/fotball/i, "fotball"],
  [/klatr/i, "klatring"],
  [/h[åa]ndball/i, "handball"],
  [/innebandy/i, "innebandy"],
  [/turn|gym/i, "turn"],
  [/allidrett/i, "allidrett"],
];

const getSport = (id?: string | null): Sport | undefined =>
  sports.find((sport) => sport.id === id);

export const resolveSport = (item: {
  sport?: string | null;
  title?: string | null;
}): Sport | undefined => {
  const byTitle =
    item.title && titleKeywords.find(([pattern]) => pattern.test(item.title!));
  return getSport(item.sport) ?? (byTitle ? getSport(byTitle[1]) : undefined);
};

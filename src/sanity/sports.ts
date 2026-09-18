/** Idrettene i laget. Emojien vises bare i Sanity Studio, ikke på nettsidene. */
export const sports = [
  { id: "fotball", title: "Fotball", emoji: "⚽" },
  { id: "klatring", title: "Klatring", emoji: "🧗" },
  { id: "handball", title: "Håndball", emoji: "🤾" },
  { id: "turn", title: "Turn & gym", emoji: "🤸" },
  { id: "innebandy", title: "Innebandy", emoji: "🏐" },
  { id: "annet", title: "Andre aktiviteter", emoji: "🏅" },
] as const;

export type SportId = (typeof sports)[number]["id"];

export const sportOptions = sports.map((sport) => ({
  title: `${sport.emoji} ${sport.title}`,
  value: sport.id,
}));

export const getSport = (id?: SportId | null) =>
  sports.find((sport) => sport.id === id);

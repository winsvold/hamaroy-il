export const sports = { climbing: { label: "Klatring", icon: "🧗" } } as const;

export type Sports = keyof typeof sports;

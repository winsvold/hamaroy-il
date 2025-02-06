export const sports = {
  climbing: { label: "Klatring", icon: "🧗" },
  circle: { label: "Sirkeltrening", icon: "🏋️‍♀️" },
} as const;

export type Sports = keyof typeof sports;

/** Delt mellom infoPage-skjemaet og Header/Footer */
export const menuPlacements = [
  { title: "I menyen", value: "meny" },
  { title: "Knapp øverst til høyre", value: "toppknapp" },
  { title: "Ikke i menyen", value: "ingen" },
] as const;

export const footerPlacements = [
  { title: "Snarveier", value: "snarveier" },
  { title: "Kontakt", value: "kontakt" },
  { title: "Ikke i bunnteksten", value: "ingen" },
] as const;

export type MenuPlacement = (typeof menuPlacements)[number]["value"];
export type FooterPlacement = (typeof footerPlacements)[number]["value"];

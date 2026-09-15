/** Delt mellom infoPage-skjemaet og Header/Footer */
export const menuPlacements = [
  { title: "Hovedmeny", value: "hovedmeny" },
  { title: "Meny (etter klubbene)", value: "sekundaermeny" },
  { title: "Knapp øverst til høyre", value: "toppknapp" },
  { title: "Bunntekst – Snarveier", value: "bunn-snarveier" },
  { title: "Bunntekst – Kontakt", value: "bunn-kontakt" },
] as const;

export type MenuPlacement = (typeof menuPlacements)[number]["value"];

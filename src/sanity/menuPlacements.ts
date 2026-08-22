/**
 * Hvor en infoside kan lenkes opp. Delt mellom `menuPlacement`-feltet på infoPage
 * og Header/Footer, slik at verdiene ikke kan komme ut av synk.
 */
export const menuPlacements = [
  { title: "Hovedmeny", value: "hovedmeny" },
  { title: "Meny (etter skillelinje)", value: "sekundaermeny" },
  { title: "Knapp øverst til høyre", value: "toppknapp" },
  { title: "Bunntekst – Snarveier", value: "bunn-snarveier" },
  { title: "Bunntekst – Kontakt", value: "bunn-kontakt" },
] as const;

export type MenuPlacement = (typeof menuPlacements)[number]["value"];

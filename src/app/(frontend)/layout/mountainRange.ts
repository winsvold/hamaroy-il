/**
 * Fjellrekka, tegnet av etter et bilde av horisonten i Hamarøy — inkludert
 * Stetind-spiret. Kopiert ordrett fra designet, for `viewBox="0 0 1440 220"`: banene
 * skal ikke forenkles, og begge må ende på `H1440` for å nå helt ut til høyre kant.
 *
 * Brukes i toppfeltet og i liten skala på arrangementskort uten bilde.
 */
export const mountainRange = {
  /** Den lave ryggen bak */
  back: "M0 220V196l90-26 96 22 84-34 120 26 96-18 130 30 110-22 128 26 96-16 130 24 110-18 150 22H1440v200z",
  front:
    "M0 220V184l72-32 52 20 66-10 74-58 68-22 92 8 62 38 40-14 44 24 26 4 10-72 12 72 46 10 52-24 42-24 34 14 26-22 30 26 70 22 100 20 100-8 150 20 100-10H1440v76z",
};

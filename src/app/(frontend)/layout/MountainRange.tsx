import { Box, BoxProps } from "@chakra-ui/react";

/** Begge banene må ende på `H1440` for å nå helt ut til høyre kant */
const paths = {
  back: "M0 220V196l90-26 96 22 84-34 120 26 96-18 130 30 110-22 128 26 96-16 130 24 110-18 150 22H1440v200z",
  front:
    "M0 220V184l72-32 52 20 66-10 74-58 68-22 92 8 62 38 40-14 44 24 26 4 10-72 12 72 46 10 52-24 42-24 34 14 26-22 30 26 70 22 100 20 100-8 150 20 100-10H1440v76z",
};

/** SVG-fyll kan ikke slå opp Chakra-tokens, så de gis som CSS-variabler */
const tokenVar = (token: string) =>
  `var(--chakra-colors-${token.replaceAll(".", "-")})`;

type Props = {
  /** Fargetoken for den bakre, halvgjennomsiktige ryggen */
  back: string;
  /** Fargetoken for selve rekka */
  front: string;
} & BoxProps;

export const MountainRange = ({ back, front, ...boxProps }: Props) => (
  <Box
    position="absolute"
    left="0"
    bottom="0"
    width="100%"
    aria-hidden="true"
    // Rekka ligger over teksten, som ellers ikke kan markeres
    pointerEvents="none"
    {...boxProps}
  >
    <svg
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      style={{ display: "block" }}
    >
      <path d={paths.back} fill={tokenVar(back)} opacity=".55" />
      <path d={paths.front} fill={tokenVar(front)} />
    </svg>
  </Box>
);

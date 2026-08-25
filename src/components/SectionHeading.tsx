import { Heading, HeadingProps } from "@chakra-ui/react";

/**
 * Seksjonsoverskriften i Syne. Skilt fra `Kicker`, som nå bare er merkelapp —
 * designet setter dem i hver sin skrift og hver sin størrelse.
 */
export const SectionHeading = (props: HeadingProps) => (
  <Heading
    as="h2"
    fontFamily="heading"
    fontWeight={700}
    fontSize={{ base: "1.5rem", md: "1.875rem" }}
    lineHeight={1.06}
    letterSpacing="-.01em"
    color="ink"
    {...props}
  />
);

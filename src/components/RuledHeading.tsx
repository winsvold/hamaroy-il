import { Box, Flex, Heading, HeadingProps } from "@chakra-ui/react";

type Props = HeadingProps & {
  /**
   * «heavy» over datobolkene, «light» over idrettskategoriene. De to står på samme
   * side, og den lettere streken er det som gjør at de leses som to nivåer.
   */
  rule?: "heavy" | "light";
};

/** Overskrift med en strek som fyller resten av linja. */
export const RuledHeading = ({ rule = "heavy", ...props }: Props) => (
  <Flex align="baseline" gap=".75rem" marginBottom=".75rem">
    <Heading
      fontFamily="heading"
      fontWeight={700}
      fontSize="1.1875rem"
      lineHeight={1.2}
      letterSpacing="-.01em"
      color="ink"
      {...props}
    />
    <Box
      flex="1"
      minWidth="2rem"
      height={rule === "heavy" ? "2px" : "1px"}
      background={rule === "heavy" ? "arctic.ink" : "hairline"}
    />
  </Flex>
);

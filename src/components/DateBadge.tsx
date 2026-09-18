import { formatNorwegianAbbreviation, formatNorwegianDate } from "@/utils/date";
import { Box, Flex, FlexProps } from "@chakra-ui/react";

type Props = {
  date: string;
  /** Størrelse og farge på selve dagen, som står større enn resten */
  daySize: FlexProps["fontSize"];
  dayColor: string;
} & FlexProps;

/** Ukedag, dag og måned stablet oppå hverandre, med hele datoen for skjermlesere */
export const DateBadge = ({ date, daySize, dayColor, ...props }: Props) => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    flexShrink={0}
    {...props}
  >
    <Box srOnly>{formatNorwegianDate(date, "EEEE d. MMMM")}</Box>
    <span aria-hidden="true">{formatNorwegianAbbreviation(date, "EEE")}</span>
    <Box
      as="span"
      aria-hidden="true"
      fontSize={daySize}
      fontWeight="extrabold"
      lineHeight={1}
      letterSpacing="normal"
      color={dayColor}
    >
      {formatNorwegianDate(date, "d")}
    </Box>
    <span aria-hidden="true">{formatNorwegianAbbreviation(date, "MMM")}</span>
  </Flex>
);

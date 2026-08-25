import { Box, BoxProps } from "@chakra-ui/react";

/**
 * Den lille versale merkelappen: kategorinavn, faktaetiketter, statusmerker og
 * kolonnetitler i bunnteksten. Seksjonsoverskrifter er `SectionHeading`.
 */
export const Kicker = (props: BoxProps) => (
  <Box textStyle="kicker" color="deep.base" {...props} />
);

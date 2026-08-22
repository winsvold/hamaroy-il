import { Box, BoxProps } from "@chakra-ui/react";

/** Den lille versale etiketten som står over hver seksjon i designet. */
export const Kicker = (props: BoxProps) => (
  <Box textStyle="kicker" color="forest.700" {...props} />
);

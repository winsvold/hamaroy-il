import { Container, ContainerProps } from "@chakra-ui/react";

/**
 * Sidebredden fra designet: 72rem innhold med 1.25/3rem luft på sidene.
 * Sider som først og fremst er lesetekst setter en smalere `maxW` selv.
 */
export const DefaultContainer = (props: ContainerProps) => (
  <Container
    maxW="72rem"
    paddingX={{ base: "1.25rem", md: "3rem" }}
    {...props}
  />
);

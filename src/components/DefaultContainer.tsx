import { Container, ContainerProps } from "@chakra-ui/react";

export const DefaultContainer = (props: ContainerProps) => (
  <Container maxW="6xl" paddingX={{ base: "1.25rem", md: "3rem" }} {...props} />
);

import { DefaultContainer } from "@/components/DefaultContainer";
import { ContainerProps, Stack } from "@chakra-ui/react";

/** Innholdet under toppfeltet, med lik avstand mellom seksjonene */
export const PageContent = ({ children, ...props }: ContainerProps) => (
  <DefaultContainer paddingTop="3.5rem" paddingBottom="5rem" {...props}>
    <Stack gap="3.5rem">{children}</Stack>
  </DefaultContainer>
);

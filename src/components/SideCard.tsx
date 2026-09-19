import { Box } from "@chakra-ui/react";
import { Kicker } from "./Kicker";

type Props = {
  title: string;
  dark?: boolean;
  children: React.ReactNode;
};

export const SideCard = ({ title, dark, children }: Props) => (
  <Box
    background={dark ? "arctic.base" : "card.base"}
    color={dark ? "onDark.base" : undefined}
    padding="1.5rem"
  >
    <Kicker
      as="h2"
      color={dark ? "aurora.green" : "deep.base"}
      marginBottom="1rem"
    >
      {title}
    </Kicker>
    {children}
  </Box>
);

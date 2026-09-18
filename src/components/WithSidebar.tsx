import { Grid, Stack } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export const WithSidebar = ({ children, sidebar }: Props) => (
  <Grid
    gridTemplateColumns={sidebar ? { base: "1fr", lg: "5fr 3fr" } : "1fr"}
    gap={{ base: "2rem", lg: "3.5rem" }}
    alignItems="start"
  >
    <Stack gap="2rem" minWidth="0">
      {children}
    </Stack>
    {sidebar && <Stack gap="1rem">{sidebar}</Stack>}
  </Grid>
);

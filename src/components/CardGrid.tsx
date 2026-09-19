import { Grid, GridProps } from "@chakra-ui/react";

// `auto-fill`, ikke `auto-fit`: få kort beholder kolonnebredden i stedet for å strekkes
export const CardGrid = (props: GridProps) => (
  <Grid
    gridTemplateColumns="repeat(auto-fill, minmax(min(20rem, 100%), 1fr))"
    gap="1rem"
    {...props}
  />
);

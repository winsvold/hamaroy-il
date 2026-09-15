import { Grid, GridProps } from "@chakra-ui/react";

/**
 * Rutenettet alle kortlistene står i: arrangementer, datobolker og faste aktiviteter.
 *
 * `auto-fill` framfor `auto-fit`: en bolk med to kort beholder kolonnebredden og lar
 * den tredje stå tom, som i designet, i stedet for å strekke de to over hele bredden.
 */
export const CardGrid = (props: GridProps) => (
  <Grid
    gridTemplateColumns="repeat(auto-fill, minmax(min(18rem, 100%), 1fr))"
    gap="1rem"
    {...props}
  />
);

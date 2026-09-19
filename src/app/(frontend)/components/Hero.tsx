import { Box, Stack } from "@chakra-ui/react";
import { HeroText, HeroTitle } from "../layout/PageHeader";
import { PageHero } from "../layout/PageHero";

type Props = {
  text?: string | null;
};

export const Hero = ({ text }: Props) => (
  <PageHero variant="front">
    <Stack gap="0" maxWidth="45rem">
      <Box fontSize={{ base: "lg", md: "2xl" }} color="aurora.green">
        Velkommen til
      </Box>
      {/* «Hamarøy» kan ikke brytes, og må få plass på smale skjermer */}
      <HeroTitle fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}>
        Hamarøy IL
      </HeroTitle>
      {text && <HeroText>{text}</HeroText>}
    </Stack>
  </PageHero>
);

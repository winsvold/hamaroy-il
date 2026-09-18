import { Kicker } from "@/components/Kicker";
import { Box, Stack } from "@chakra-ui/react";
import { HeroText, HeroTitle } from "../layout/PageHeader";
import { PageHero } from "../layout/PageHero";

type Props = {
  title?: string | null;
  text?: string | null;
};

export const Hero = ({ title, text }: Props) => (
  <PageHero variant="front">
    <Stack gap="0" maxWidth="45rem">
      {!title && (
        <Box fontSize={{ base: "lg", md: "2xl" }} color="onDark.soft">
          Velkommen til
        </Box>
      )}
      {/* «Hamarøy» kan ikke brytes, og må få plass på smale skjermer */}
      <HeroTitle fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}>
        {title || "Hamarøy IL"}
      </HeroTitle>
      <Kicker color="aurora.green" marginTop="1rem">
        68° nord · siden 1937
      </Kicker>
      {text && <HeroText>{text}</HeroText>}
    </Stack>
  </PageHero>
);

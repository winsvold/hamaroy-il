import { Kicker } from "@/components/Kicker";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { PageHero } from "../layout/PageHero";

type Props = {
  title?: string | null;
  text?: string | null;
};

export const Hero = (props: Props) => (
  <PageHero variant="front">
    <Stack gap="0" maxWidth="43.75rem">
      <Box
        fontSize={{ base: "1.125rem", md: "1.625rem" }}
        color="onDark.soft"
        marginBottom=".125rem"
      >
        Velkommen til
      </Box>
      <Heading
        as="h1"
        fontFamily="heading"
        fontWeight={800}
        // Syne er en bred skrift: «Hamarøy» alene er ett ord som ikke kan brytes,
        // og sprenger 390 px allerede ved 2.75rem
        fontSize={{ base: "2.25rem", sm: "2.75rem", md: "4.125rem" }}
        lineHeight={0.98}
        letterSpacing="-.02em"
        color="onDark.base"
        css={{ hyphens: "auto", overflowWrap: "break-word" }}
      >
        {props.title || "Hamarøy IL"}
      </Heading>
      <Kicker color="aurora.green" marginTop="1.125rem">
        68° nord · siden 1937
      </Kicker>
      {/*
        Designet har ingen plass til ingressen, men feltet finnes og er redaktørens.
        Den står derfor under merkelappen, og seksjonen faller tilbake til designets
        oppsett når feltet er tomt.
      */}
      {props.text && (
        <Text
          fontSize={{ base: "0.9375rem", md: "1rem" }}
          lineHeight={1.6}
          color="onDark.soft"
          maxWidth="30rem"
          marginTop="1.125rem"
        >
          {props.text}
        </Text>
      )}
    </Stack>
  </PageHero>
);

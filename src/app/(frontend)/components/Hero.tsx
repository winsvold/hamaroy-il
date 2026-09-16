import { Kicker } from "@/components/Kicker";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { PageHero } from "../layout/PageHero";

type Props = {
  title?: string | null;
  text?: string | null;
};

export const Hero = (props: Props) => (
  <PageHero variant="front">
    <Stack gap="0" maxWidth="45rem">
      <Box
        fontSize={{ base: "lg", md: "2xl" }}
        color="onDark.soft"
        marginBottom="0"
      >
        Velkommen til
      </Box>
      <Heading
        as="h1"
        fontFamily="heading"
        fontWeight="extrabold"
        // «Hamarøy» kan ikke brytes, og må få plass på smale skjermer
        fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
        lineHeight={1}
        letterSpacing="tight"
        color="onDark.base"
        css={{ hyphens: "auto", overflowWrap: "break-word" }}
      >
        {props.title || "Hamarøy IL"}
      </Heading>
      <Kicker color="aurora.green" marginTop="1rem">
        68° nord · siden 1937
      </Kicker>
      {props.text && (
        <Text
          fontSize="md"
          lineHeight={1.5}
          color="onDark.soft"
          maxWidth="30rem"
          marginTop="1rem"
        >
          {props.text}
        </Text>
      )}
    </Stack>
  </PageHero>
);

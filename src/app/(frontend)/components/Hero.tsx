import { DefaultContainer } from "@/components/DefaultContainer";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";

type Props = {
  title?: string | null;
  text?: string | null;
};

export const Hero = (props: Props) => (
  <Box
    as="section"
    position="relative"
    overflow="hidden"
    background="amber.500"
  >
    {/*
      Den diagonale grønne flaten fra designet. Under `md` droppes skråstillingen og
      flaten dekker alt: på smale skjermer krysser teksten ellers over på det oransje
      feltet, og lys tekst på oransje er ikke lesbart.
    */}
    <Box
      position="absolute"
      inset="0"
      background="forest.700"
      clipPath={{
        base: "none",
        md: "polygon(0 0, 62% 0, 44% 100%, 0 100%)",
      }}
    />
    <DefaultContainer position="relative">
      <Stack
        gap="1.1rem"
        paddingY={{ base: "2.5rem", md: "3.5rem" }}
        maxWidth={{ base: "100%", md: "34rem" }}
      >
        <Heading
          as="h1"
          fontFamily="heading"
          fontWeight={800}
          fontSize={{ base: "2.25rem", md: "2.75rem" }}
          lineHeight={1.04}
          color="onDark"
          // Jevner ut linjelengdene, så tittelen ikke brekker med ett ord alene
          textWrap="balance"
        >
          {props.title || "Velkommen til Hamarøy IL"}
        </Heading>
        {props.text && (
          <Text
            fontSize={{ base: "0.9rem", md: "1rem" }}
            fontWeight={500}
            lineHeight={1.6}
            color="onDark"
            opacity={0.92}
            maxWidth="30rem"
          >
            {props.text}
          </Text>
        )}
      </Stack>
    </DefaultContainer>
  </Box>
);

import { DefaultContainer } from "@/components/DefaultContainer";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { Sessions } from "./components/sessions";

export default function Home() {
  return (
    <DefaultContainer marginY="1rem">
      <Stack>
        <Stack backgroundColor="yellow.100" borderRadius="md" padding="1rem">
          <Heading>Under utvikling</Heading>
          <Text fontSize="lg">
            Vi får nye nettsider, og for øyeblikket ser de ikke all verden ut,
            men her vil det komme mye nytt iløpet av vinteren. Følg med, og si
            gjerne fra om du har innspill!
          </Text>
        </Stack>
        <Sessions />
      </Stack>
    </DefaultContainer>
  );
}

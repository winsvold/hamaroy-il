import { DefaultContainer } from "@/components/DefaultContainer";
import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import { Activities } from "./components/activities";
import Link from "next/link";

export default function Home() {
  return (
    <DefaultContainer marginY="1rem">
      <Stack gap="3rem">
        <Stack backgroundColor="yellow.100" borderRadius="md" padding="1rem">
          <Heading>Under utvikling</Heading>
          <Text fontSize="lg">
            Vi får nye nettsider, og for øyeblikket ser de ikke all verden ut,
            men her vil det komme mye nytt iløpet av vinteren. Følg med, og si
            gjerne fra om du har innspill!
          </Text>
        </Stack>
        <Stack gap="1rem">
          <Heading as="h2" size="xl">
            Kommende aktiviteter
          </Heading>
          <Activities limit={6} />
          <Button size="lg" variant="solid" asChild alignSelf="flex-start">
            <Link href="/aktiviteter">Se alle</Link>
          </Button>
        </Stack>
      </Stack>
    </DefaultContainer>
  );
}

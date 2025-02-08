import { DefaultContainer } from "@/components/DefaultContainer";
import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

const Page = () => {
  return (
    <DefaultContainer>
      <Stack marginY="2rem">
        <Heading>404</Heading>
        <Text>Siden ble ikke funnet</Text>
        <Button asChild variant="subtle" alignSelf="flex-start">
          <Link href="/">Tilbake til forsiden</Link>
        </Button>
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

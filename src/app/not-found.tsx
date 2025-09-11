import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import RootLayout from "./(frontend)/layout";
import { DefaultContainer } from "@/components/DefaultContainer";

const Page = () => {
  return (
    <RootLayout>
      <DefaultContainer>
        <Stack marginY="2rem">
          <Heading>404</Heading>
          <Text>Siden ble ikke funnet</Text>
          <Button asChild variant="subtle" alignSelf="flex-start">
            <Link href="/">Tilbake til forsiden</Link>
          </Button>
        </Stack>
      </DefaultContainer>
    </RootLayout>
  );
};

export default Page;

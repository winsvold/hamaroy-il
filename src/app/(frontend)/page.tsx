import { DefaultContainer } from "@/components/DefaultContainer";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Link from "next/link";
import { Activities } from "./components/activities";

const frontPageQuery = defineQuery(`{
  "intro": *[_type == "siteSettings"][0].intro
}`);

export default async function Home() {
  const data = await sanityFetch(frontPageQuery);

  return (
    <DefaultContainer marginY="1rem">
      <Stack gap="3rem">
        {data.intro && (
          <Box backgroundColor="yellow.100" borderRadius="md" padding="1rem">
            <RichText blockContent={data.intro} />
          </Box>
        )}
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

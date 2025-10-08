import { DefaultContainer } from "@/components/DefaultContainer";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { Box, Button, Grid, Heading, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Link from "next/link";
import { Calendar } from "./components/calendar";
import { EventCard } from "./components/EventCard";

const frontPageQuery = defineQuery(`{
  "intro": *[_type == "siteSettings"][0].intro,
  "events": *[_type == "event" && endsAt > now()] | order(startsAt asc) {
    ...,
    location->,
  }
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
        {!!data.events?.length && (
          <Stack gap=".5rem">
            <Heading as="h2">Gå ikke glipp av</Heading>
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "1fr 1fr",
              }}
              gap=".75rem"
            >
              {data.events.map((event) => (
                <EventCard key={event._id} {...event} />
              ))}
            </Grid>
          </Stack>
        )}
        <Calendar
          heading="Kommende aktiviteter"
          limit={6}
          childrenAfter={
            <Button size="lg" variant="solid" asChild alignSelf="flex-start">
              <Link href="/kalender">Se alle</Link>
            </Button>
          }
        />
      </Stack>
    </DefaultContainer>
  );
}

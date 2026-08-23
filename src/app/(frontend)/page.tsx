import { DefaultContainer } from "@/components/DefaultContainer";
import { Kicker } from "@/components/Kicker";
import { sanityFetch } from "@/sanity/lib/client";
import { Box, Button, Grid, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Link from "next/link";
import { Calendar } from "./components/calendar";
import { EventCard } from "./components/EventCard";
import { Hero } from "./components/Hero";
import { Messages } from "./components/Messages";
import { RecurringEvents } from "./components/RecurringEvents";

const frontPageQuery = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{ heroTitle, heroText },
  "intro": *[_type == "siteSettings"][0].intro,
  "messages": *[
    _type == "message" && (!defined(expiresAt) || expiresAt > now())
  ] | order(publishedAt desc) {
    _id,
    label,
    body,
  },
  "events": *[_type == "event" && endsAt > now()] | order(startsAt asc) {
    ...,
    location->,
  }
}`);

/** Antall arrangementer som løftes fram i «Gå ikke glipp av» */
const highlightedEventCount = 3;

export default async function Home() {
  const data = await sanityFetch(frontPageQuery);

  const highlightedEvents = data.events.slice(0, highlightedEventCount);

  return (
    <Stack gap={{ base: "3rem", md: "4.5rem" }}>
      <Hero title={data.settings?.heroTitle} text={data.settings?.heroText} />

      {!!highlightedEvents.length && (
        <DefaultContainer>
          <Stack gap="1.25rem" as="section">
            <Kicker as="h2">Gå ikke glipp av</Kicker>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(min(20rem, 100%), 1fr))"
              gap="1rem"
              alignItems="stretch"
            >
              {highlightedEvents.map((event) => (
                <EventCard key={event._id} {...event} />
              ))}
            </Grid>
          </Stack>
        </DefaultContainer>
      )}

      <DefaultContainer>
        <Grid
          gridTemplateColumns={{ base: "1fr", lg: "1.15fr 1fr" }}
          gap={{ base: "3rem", lg: "2.5rem" }}
          alignItems="start"
        >
          <Calendar
            heading="Kommende aktiviteter"
            limit={6}
            // Arrangementene over står allerede øverst på siden
            excludeIds={highlightedEvents.map((event) => event._id)}
            childrenAfter={
              <Button
                asChild
                alignSelf="center"
                background="forest.700"
                color="onDark"
                _hover={{ background: "forest.800" }}
                borderRadius="lg"
                fontWeight={700}
                size="lg"
              >
                <Link href="/kalender">Se hele kalenderen →</Link>
              </Button>
            }
          />
          <Messages messages={data.messages} intro={data.intro} />
        </Grid>
      </DefaultContainer>

      <DefaultContainer>
        <RecurringEvents heading="Faste aktiviteter" />
      </DefaultContainer>

      {/* Plass under siste seksjon før bunnteksten */}
      <Box />
    </Stack>
  );
}

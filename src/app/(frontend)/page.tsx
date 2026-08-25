import { DefaultContainer } from "@/components/DefaultContainer";
import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { Box, Grid } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import { Calendar, CalendarActionBar } from "./components/calendar";
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
    <>
      <Hero title={data.settings?.heroTitle} text={data.settings?.heroText} />

      {!!highlightedEvents.length && (
        <DefaultContainer paddingTop="3.75rem">
          <Box as="section">
            <SectionHeading marginBottom="1.5rem">
              Gå ikke glipp av
            </SectionHeading>
            <Grid
              gridTemplateColumns="repeat(auto-fit, minmax(min(20rem, 100%), 1fr))"
              gap="1rem"
              alignItems="stretch"
            >
              {highlightedEvents.map((event) => (
                <EventCard key={event._id} {...event} />
              ))}
            </Grid>
          </Box>
        </DefaultContainer>
      )}

      <DefaultContainer paddingTop="3.75rem">
        <Grid
          gridTemplateColumns={{ base: "1fr", lg: "1.5fr 1fr" }}
          gap={{ base: "3rem", lg: "4rem" }}
          alignItems="start"
        >
          {/*
            Arrangementene over gjentas med vilje her: båndet framhever, mens tidslinja
            er den fullstendige oversikten over hva som skjer framover.
          */}
          <Calendar
            heading="Kommende aktiviteter"
            limit={6}
            childrenAfter={
              <CalendarActionBar href="/kalender">
                Se hele kalenderen →
              </CalendarActionBar>
            }
          />
          <Messages messages={data.messages} intro={data.intro} />
        </Grid>
      </DefaultContainer>

      <DefaultContainer paddingTop="3.75rem" paddingBottom="4.75rem">
        <RecurringEvents heading="Faste aktiviteter" />
      </DefaultContainer>
    </>
  );
}

import { CallToAction } from "@/components/CallToAction";
import { CardGrid } from "@/components/CardGrid";
import { DefaultContainer } from "@/components/DefaultContainer";
import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { Box } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import { Calendar } from "./components/calendar";
import { EventCard } from "./components/EventCard";
import { Hero } from "./components/Hero";
import { RecurringEvents } from "./components/RecurringEvents";
import { Welcome } from "./components/Welcome";

const frontPageQuery = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{ heroTitle, heroText },
  "intro": *[_type == "siteSettings"][0].intro,
  "events": *[_type == "event" && endsAt > now()] | order(startsAt asc) {
    ...,
    location->,
  }
}`);

const highlightedEventCount = 3;

export default async function Home() {
  const data = await sanityFetch(frontPageQuery);

  const highlightedEvents = data.events.slice(0, highlightedEventCount);

  return (
    <>
      <Hero title={data.settings?.heroTitle} text={data.settings?.heroText} />

      <Welcome intro={data.intro} />

      {!!highlightedEvents.length && (
        <DefaultContainer paddingTop="3.25rem">
          <Box as="section">
            <SectionHeading marginBottom="1.5rem">
              Gå ikke glipp av
            </SectionHeading>
            <CardGrid>
              {highlightedEvents.map((event) => (
                <EventCard key={event._id} {...event} />
              ))}
            </CardGrid>
          </Box>
        </DefaultContainer>
      )}

      <DefaultContainer paddingTop="3.25rem">
        <Calendar
          heading="Kommende aktiviteter"
          limit={6}
          childrenAfter={
            <CallToAction href="/kalender" marginTop="1.875rem">
              Se hele kalenderen →
            </CallToAction>
          }
        />
      </DefaultContainer>

      <DefaultContainer paddingTop="3.25rem" paddingBottom="4.75rem">
        <RecurringEvents heading="Faste aktiviteter" />
      </DefaultContainer>
    </>
  );
}

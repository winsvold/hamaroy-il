import { CardGrid } from "@/components/CardGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { Box } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import { Calendar } from "./components/calendar";
import { EventCard } from "./components/EventCard";
import { Hero } from "./components/Hero";
import { RecurringEvents } from "./components/RecurringEvents";
import { Welcome } from "./components/Welcome";
import { PageContent } from "./layout/PageContent";

const frontPageQuery = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{ heroText, intro },
  "events": *[_type == "event" && endsAt > now()] | order(startsAt asc) [0...3] {
    _id,
    title,
    startsAt,
    endsAt,
    "image": images[defined(asset)][0],
    location->{ name },
  }
}`);

export default async function Home() {
  const { settings, events } = await sanityFetch(frontPageQuery);

  return (
    <>
      <Hero text={settings?.heroText} />
      <PageContent>
        <Welcome intro={settings?.intro} />
        {!!events.length && (
          <Box as="section">
            <SectionHeading>Gå ikke glipp av</SectionHeading>
            <CardGrid>
              {events.map((event) => (
                <EventCard key={event._id} {...event} />
              ))}
            </CardGrid>
          </Box>
        )}
        <Calendar heading="Kommende aktiviteter" limit={6} showCalendarLink />
        <RecurringEvents heading="Faste aktiviteter" />
      </PageContent>
    </>
  );
}

import { sanityClient } from "@/sanity/lib/client";
import { getSessionEndsAt } from "@/utils/session";
import { Grid } from "@chakra-ui/react";
import { isAfter } from "date-fns";
import { defineQuery } from "next-sanity";
import { sift } from "radash";
import { SessionCard, SessionOccurrence } from "./SessionCard";
import { EventCard } from "./EventCard";

const activitiesQuery = defineQuery(`{
  "sessionSeries": *[_type == "sessionSeries" && (!defined($seriesId) || _id == $seriesId) && (!defined($locationId) || location._ref == $locationId)]{
    ...,
    location->,
    organizers[]->,
  },
  "events": *[_type == "event"] {
    ...,
    location->,
    organizers[]->,
  }
}`);

type Props = {
  limit?: number;
  seriesId?: string;
  locationId?: string;
};

export const Sessions = async (props: Props) => {
  const { sessionSeries, events } = await sanityClient.fetch(activitiesQuery, {
    seriesId: props.seriesId ?? null,
    locationId: props.locationId ?? null,
  });

  const sessions: SessionOccurrence[] = sift(
    sessionSeries.flatMap((series) =>
      series.sessions?.map((session) => ({
        series,
        ...session,
      })),
    ),
  ).filter(
    (session) =>
      session && isAfter(new Date(getSessionEndsAt(session)), new Date()),
  );

  const sortedEventsAndSessions = [...events, ...sessions]
    .sort(
      (a, b) =>
        new Date(a.startsAt!).getTime() - new Date(b.startsAt!).getTime(),
    )
    .slice(0, props.limit);

  return (
    <Grid
      gap=".5rem"
      gridTemplateColumns="repeat(auto-fill, minmax(15rem, 1fr))"
    >
      {sortedEventsAndSessions.map((session) =>
        session._type === "event" ? (
          <EventCard gridColumn="span 2" key={session._id} event={session} />
        ) : (
          <SessionCard key={session._key} session={session} />
        ),
      )}
    </Grid>
  );
};

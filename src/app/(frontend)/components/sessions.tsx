import { sanityClient } from "@/sanity/lib/client";
import { getSessionEndsAt } from "@/utils/session";
import { Grid } from "@chakra-ui/react";
import { isAfter } from "date-fns";
import { defineQuery } from "next-sanity";
import { sift } from "radash";
import { SessionCard, SessionOccurrence } from "./SessionCard";

const sessionsSeriesQuery =
  defineQuery(`*[_type == "sessionSeries" && (!defined($seriesId) || _id == $seriesId)]{
  ...,
  location->,
  organizers[]->,
}`);

type Props = {
  limit?: number;
  seriesId?: string;
};

export const Sessions = async (props: Props) => {
  const sessionSeries = await sanityClient.fetch(sessionsSeriesQuery, {
    seriesId: props.seriesId ?? null,
  });

  const sessions: SessionOccurrence[] = sift(
    sessionSeries.flatMap((series) =>
      series.sessions?.map((session) => ({
        series,
        ...session,
      })),
    ),
  )
    .filter(
      (session) =>
        session && isAfter(new Date(getSessionEndsAt(session)), new Date()),
    )
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
      {sessions.map((session) => (
        <SessionCard key={session._key} session={session} />
      ))}
    </Grid>
  );
};

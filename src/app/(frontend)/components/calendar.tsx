import { sanityFetch } from "@/sanity/lib/client";
import { formatNorwegianDate } from "@/utils/date";
import { getSessionEndsAt } from "@/utils/session";
import {
  Box,
  Flex,
  FlexProps,
  Grid,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { isAfter, startOfDay } from "date-fns";
import { defineQuery } from "next-sanity";
import { group, sift } from "radash";
import { KeyedSegment } from "sanity";
import { ActivitiesQueryResult, Session } from "../../../../sanity.types";
import { CalendarCard } from "./CalendarCard";

const activitiesQuery = defineQuery(`{
  "eventsAndSessionSeries": *[
    _type in ["sessionSeries", "event"] && 
    (!defined($seriesId) || _id == $seriesId) && 
    (!defined($locationId) || location._ref == $locationId) &&
    (!defined($clubId) || references($clubId))
  ]
  {
    ...,
    location->,
    organizers[]->,
  },
}`);

type Props = {
  limit?: number;
  seriesId?: string;
  locationId?: string;
  heading?: string;
  clubId?: string;
  childrenAfter?: React.ReactNode;
};

export type SessionOccurrence = Session &
  KeyedSegment & {
    series: Extract<
      ActivitiesQueryResult["eventsAndSessionSeries"][number],
      { _type: "sessionSeries" }
    >;
  };

export const Calendar = async (props: Props) => {
  const { eventsAndSessionSeries } = await sanityFetch(activitiesQuery, {
    seriesId: props.seriesId ?? null,
    locationId: props.locationId ?? null,
    clubId: props.clubId ?? null,
  });

  const sessionSeries = eventsAndSessionSeries.filter(
    (item) => item._type === "sessionSeries",
  );

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

  const events = eventsAndSessionSeries
    .filter((item) => item._type === "event")
    .filter(
      (event) => event.endsAt && isAfter(new Date(event.endsAt), new Date()),
    );

  const sortedEventsAndSessions = [...events, ...sessions]
    .sort(
      (a, b) =>
        new Date(a.startsAt!).getTime() - new Date(b.startsAt!).getTime(),
    )
    .slice(0, props.limit);

  const groupedByDate = group(
    sortedEventsAndSessions,
    (item) =>
      (item.startsAt && startOfDay(new Date(item.startsAt)).toISOString()) ||
      "Ukjent dato",
  );

  const entries = Object.entries(groupedByDate);

  if (entries.length === 0)
    return (
      <Stack>
        <Heading as="h2">{props.heading}</Heading>
        <Text>Vi har for øyeblikket ingen planlagte aktiviteter</Text>
      </Stack>
    );

  return (
    <Stack>
      {props.heading && <Heading as="h2">{props.heading}</Heading>}
      <Stack gap="1rem">
        {entries.map(([date, activities]) => (
          <Grid
            key={date}
            gap={{ base: ".5rem", sm: "1rem" }}
            gridTemplateColumns={{ base: "3rem 1fr", sm: "4rem 1fr" }}
          >
            <Box position="relative">
              <Box
                position="absolute"
                height="calc(100% + 1rem)"
                top="0"
                left="50%"
                transform="translateX(-50%)"
                border=".1rem solid"
                borderColor="gray.200"
              />
              <DatoBadge position="sticky" top=".75rem" date={date} />
            </Box>
            <Stack gap=".5rem" alignItems="flex-start">
              {activities?.map((session) =>
                session._type === "event" ? (
                  <CalendarCard
                    key={session._id}
                    startsAt={session.startsAt}
                    endsAt={session.endsAt}
                    title={session.title}
                    location={session.location}
                    slug={session._id}
                    image={session.images?.[0]}
                    type="event"
                  />
                ) : (
                  <CalendarCard
                    key={session._key}
                    startsAt={session.startsAt}
                    endsAt={getSessionEndsAt(session).toISOString()}
                    title={session.series.title}
                    location={session.series.location}
                    slug={session.series.slug?.current}
                    cancelled={session.cancelled}
                    note={session.note}
                    type="session"
                  />
                ),
              )}
            </Stack>
          </Grid>
        ))}
      </Stack>
      {props.childrenAfter}
    </Stack>
  );
};

export const DatoBadge = ({
  date,
  ...chakraProps
}: { date: string } & FlexProps) => (
  <Flex
    flexDirection="column"
    as="p"
    padding=".5rem"
    minWidth={{ sm: "3.5rem" }}
    textAlign="center"
    alignItems="center"
    borderRadius="md"
    backgroundColor="green.700"
    color="white"
    fontWeight={600}
    lineHeight={1}
    title={formatNorwegianDate(date, "PPP p")}
    fontSize={{ base: ".8rem", sm: "0.9rem" }}
    {...chakraProps}
  >
    <Box as="span">{formatNorwegianDate(date, "E")}</Box>
    <Box as="span" fontSize="1.5em">
      {formatNorwegianDate(date, "d")}
    </Box>
    <Box as="span">{formatNorwegianDate(date, "MMM").replace(".", "")}</Box>
  </Flex>
);

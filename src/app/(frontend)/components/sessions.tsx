import { sanityClient } from "@/sanity/lib/client";
import { formatNorwegianDate } from "@/utils/date";
import { getSessionEndsAt } from "@/utils/session";
import { sports } from "@/utils/sports";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import isAfter from "date-fns/isAfter";
import { defineQuery } from "next-sanity";
import { sift } from "radash";
import { KeyedSegment } from "sanity";
import { Session, SessionsSeriesQueryResult } from "../../../../sanity.types";
import { Clock, MapPin } from "react-feather";

const sessionsSeriesQuery = defineQuery(`*[_type == "sessionSeries"]{
  ...,
  location->,
  organizers[]->,
}`);

export const Sessions = async () => {
  const sessionSeries = await sanityClient.fetch(sessionsSeriesQuery);

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
    );

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

type SessionOccurrence = Session &
  KeyedSegment & {
    series: SessionsSeriesQueryResult[number];
  };

const SessionCard = ({ session }: { session: SessionOccurrence }) => {
  if (!session) return null;
  const { startsAt } = session;
  if (!startsAt) return null;

  return (
    <Flex
      padding="1rem"
      borderRadius="md"
      backgroundColor="blue.100"
      gap=".5rem"
      alignItems="flex-start"
    >
      <Flex
        flexDirection="column"
        as="p"
        padding=".5rem"
        minWidth="3.5rem"
        textAlign="center"
        borderRadius="md"
        backgroundColor="blackAlpha.200"
        fontWeight={600}
        lineHeight={1.2}
        title={formatNorwegianDate(startsAt, "PPP p")}
        fontSize="0.9rem"
      >
        <Box as="span" fontSize="1.5em">
          {formatNorwegianDate(startsAt, "d")}
        </Box>
        <Box as="span">{formatNorwegianDate(startsAt, "MMM")}</Box>
      </Flex>
      <Box>
        <Flex alignItems="center" gap=".5rem">
          <Heading as="h3">{session.series.title}</Heading>{" "}
          {session.series.sport && sports[session.series.sport].icon}
        </Flex>
        <Text fontWeight={600} display="flex" alignItems="center" gap=".5em">
          <Clock />
          {formatNorwegianDate(startsAt, "p")} -{" "}
          {formatNorwegianDate(getSessionEndsAt(session), "p")}
        </Text>
        <Text display="flex" alignItems="center" gap=".5em">
          <MapPin /> {session.series.location?.title}
        </Text>
      </Box>
    </Flex>
  );
};

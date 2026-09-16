import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { formatNorwegianDate } from "@/utils/date";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { startOfDay } from "date-fns";
import { defineQuery } from "next-sanity";
import Link from "next/link";
import { group } from "radash";
import { ActivitiesQueryResult } from "../../../../sanity.types";
import { CalendarCard } from "./CalendarCard";

const activitiesQuery = defineQuery(`{
  "events": *[
    _type == "event" &&
    endsAt > now() &&
    (!defined($seriesId) || _id == $seriesId) &&
    (!defined($locationId) || location._ref == $locationId) &&
    (!defined($clubId) || references($clubId))
  ] | order(startsAt asc) {
    _id,
    _type,
    title,
    startsAt,
    endsAt,
    location->{ _id, name },
  },
  "sessionSeries": *[
    _type == "sessionSeries" &&
    (!defined($seriesId) || _id == $seriesId) &&
    (!defined($locationId) || location._ref == $locationId) &&
    (!defined($clubId) || references($clubId))
  ] {
    _id,
    title,
    slug,
    location->{ _id, name },
    "sessions": sessions[] {
      _key,
      cancelled,
      note,
      "startsAt": dateTime(startsAt),
      "endsAt": dateTime(startsAt) + duration.hours * 60 * 60 + duration.minutes * 60,
    } [defined(startsAt) && dateTime(endsAt) > dateTime(now())] | order(startsAt asc) [0...$sessionLimit],
  },
}`);

// Ingen serie trenger flere sesjoner enn `limit`. Uten limit hentes i praksis alle.
const NO_SESSION_LIMIT = 1000;

type Props = {
  limit?: number;
  seriesId?: string;
  locationId?: string;
  heading?: string;
  clubId?: string;
  excludeIds?: string[];
  hideTitles?: boolean;
  /** Tom liste: tomkort (standard), en linje tekst eller ingenting */
  whenEmpty?: "card" | "note" | "hide";
  childrenAfter?: React.ReactNode;
};

type SessionSeries = ActivitiesQueryResult["sessionSeries"][number];

export type SessionOccurrence = NonNullable<
  SessionSeries["sessions"]
>[number] & {
  _type: "session";
  series: SessionSeries;
};

export const Calendar = async (props: Props) => {
  const { events, sessionSeries } = await sanityFetch(activitiesQuery, {
    seriesId: props.seriesId ?? null,
    locationId: props.locationId ?? null,
    clubId: props.clubId ?? null,
    sessionLimit: props.limit ?? NO_SESSION_LIMIT,
  });

  const excluded = new Set(props.excludeIds ?? []);

  const sessions: SessionOccurrence[] = sessionSeries
    .filter((series) => !excluded.has(series._id))
    .flatMap((series) =>
      (series.sessions ?? []).map((session) => ({
        ...session,
        _type: "session" as const,
        series,
      })),
    );

  const sortedEventsAndSessions = [
    ...events.filter((event) => !excluded.has(event._id)),
    ...sessions,
  ]
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

  const heading = props.heading && (
    <SectionHeading marginBottom="1.5rem">{props.heading}</SectionHeading>
  );

  if (entries.length === 0) {
    const whenEmpty = props.whenEmpty ?? "card";
    if (whenEmpty === "hide") return null;
    return (
      <Box>
        {heading}
        {whenEmpty === "note" ? (
          <Text fontSize="md" color="muted">
            Treningstidene legges ut så snart sesongen er satt.
          </Text>
        ) : (
          <EmptyState />
        )}
      </Box>
    );
  }

  return (
    <Box>
      {heading}
      <Box position="relative">
        {/* Tidslinja, midt gjennom datobrikkene */}
        <Box
          position="absolute"
          top="1rem"
          bottom="1rem"
          left={{ base: "calc(2rem - 1px)", md: "calc(2.75rem - 1px)" }}
          width="2px"
          background="hairline"
          aria-hidden="true"
        />
        <Stack gap="1rem">
          {entries.map(([date, activities]) => (
            <Flex
              key={date}
              position="relative"
              align="flex-start"
              gap={{ base: "1rem", md: "1.5rem" }}
            >
              <DatePill date={date} as={props.heading ? "h3" : "h2"} />
              <Stack gap=".5rem" align="flex-start" flex="1" minWidth="0">
                {activities?.map((item) =>
                  item._type === "event" ? (
                    <CalendarCard
                      key={item._id}
                      startsAt={item.startsAt}
                      endsAt={item.endsAt}
                      title={item.title}
                      location={item.location}
                      slug={item._id}
                    />
                  ) : (
                    <CalendarCard
                      key={item._key}
                      startsAt={item.startsAt}
                      endsAt={item.endsAt}
                      title={item.series.title}
                      location={item.series.location}
                      slug={item.series.slug?.current}
                      cancelled={item.cancelled}
                      note={item.note}
                      hideTitle={props.hideTitles}
                    />
                  ),
                )}
              </Stack>
            </Flex>
          ))}
        </Stack>
      </Box>
      {props.childrenAfter}
    </Box>
  );
};

const DatePill = ({ date, as }: { date: string; as: "h2" | "h3" }) => (
  <Heading
    as={as}
    display="flex"
    flexDirection="column"
    alignItems="center"
    flexShrink={0}
    width={{ base: "4rem", md: "5.5rem" }}
    padding=".75rem 0"
    background="arctic.base"
    fontFamily="body"
    lineHeight={1.25}
  >
    <Box srOnly>{formatNorwegianDate(date, "EEEE d. MMMM")}</Box>
    <Box
      as="span"
      aria-hidden="true"
      fontSize="sm"
      fontWeight="bold"
      letterSpacing="wider"
      color="aurora.green"
    >
      {formatNorwegianDate(date, "EEE").replace(".", "")}
    </Box>
    <Box
      as="span"
      aria-hidden="true"
      fontSize="3xl"
      fontWeight="extrabold"
      lineHeight={1}
      margin="0"
      color="onDark.base"
    >
      {formatNorwegianDate(date, "d")}
    </Box>
    <Box
      as="span"
      aria-hidden="true"
      fontSize="sm"
      fontWeight="bold"
      letterSpacing="wider"
      color="aurora.green"
    >
      {formatNorwegianDate(date, "MMM").replace(".", "")}
    </Box>
  </Heading>
);

const EmptyState = () => (
  <Stack background="card.base" padding="1.5rem" gap=".5rem" align="flex-start">
    <Text fontWeight="bold" fontSize="lg" color="ink">
      Ingen planlagte aktiviteter akkurat nå
    </Text>
    <Text fontSize="sm" color="muted">
      Treningstidene legges ut så snart sesongen er satt.
    </Text>
    <Box
      asChild
      textStyle="kicker"
      color="deep.base"
      marginTop=".5rem"
      _hover={{ color: "deep.hover" }}
    >
      <Link href="/faste-aktiviteter">Se alle faste tilbud →</Link>
    </Box>
  </Stack>
);

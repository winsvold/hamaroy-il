import { CallToAction } from "@/components/CallToAction";
import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { formatNorwegianAbbreviation, formatNorwegianDate } from "@/utils/date";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Link from "next/link";
import { group, sift } from "radash";
import { ActivitiesQueryResult } from "../../../../sanity.types";
import { CalendarCard, CalendarEntry } from "./CalendarCard";

const activitiesQuery = defineQuery(`{
  "events": *[
    _type == "event" &&
    endsAt > now() &&
    (!defined($seriesId) || _id == $seriesId) &&
    (!defined($excludeId) || _id != $excludeId) &&
    (!defined($locationId) || location._ref == $locationId) &&
    (!defined($clubId) || references($clubId))
  ] {
    _id,
    title,
    startsAt,
    endsAt,
    location->{ name },
  },
  "sessionSeries": *[
    _type == "sessionSeries" &&
    (!defined($seriesId) || _id == $seriesId) &&
    (!defined($excludeId) || _id != $excludeId) &&
    (!defined($locationId) || location._ref == $locationId) &&
    (!defined($clubId) || references($clubId))
  ] {
    _id,
    title,
    slug,
    location->{ name },
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

const noSessionsYet = "Treningstidene legges ut så snart sesongen er satt.";

type Props = {
  heading?: string;
  limit?: number;
  seriesId?: string;
  locationId?: string;
  clubId?: string;
  excludeId?: string;
  hideTitles?: boolean;
  showCalendarLink?: boolean;
  /** Tom liste: tomkort (standard), en linje tekst eller ingenting */
  whenEmpty?: "card" | "note" | "hide";
};

export const Calendar = async (props: Props) => {
  const data = await sanityFetch(activitiesQuery, {
    seriesId: props.seriesId ?? null,
    locationId: props.locationId ?? null,
    clubId: props.clubId ?? null,
    excludeId: props.excludeId ?? null,
    sessionLimit: props.limit ?? NO_SESSION_LIMIT,
  });
  const days = toDays(data, props.limit);

  const heading = props.heading && (
    <SectionHeading>{props.heading}</SectionHeading>
  );

  if (!days.length) {
    const empty = {
      card: <EmptyState />,
      note: <Text color="muted">{noSessionsYet}</Text>,
      hide: null,
    }[props.whenEmpty ?? "card"];

    return (
      empty && (
        <Box as="section">
          {heading}
          {empty}
        </Box>
      )
    );
  }

  return (
    <Box as="section">
      {heading}
      <Timeline
        days={days}
        dayHeadingAs={props.heading ? "h3" : "h2"}
        hideTitles={props.hideTitles}
      />
      {props.showCalendarLink && (
        <CallToAction href="/kalender" marginTop="2rem">
          Se hele kalenderen →
        </CallToAction>
      )}
    </Box>
  );
};

/** Arrangementer og sesjoner i én liste, sortert og gruppert per dag i norsk tid */
const toDays = (
  { events, sessionSeries }: ActivitiesQueryResult,
  limit?: number,
) => {
  const entries: CalendarEntry[] = sift([
    ...events.map(
      (event) =>
        event.startsAt && {
          id: event._id,
          startsAt: event.startsAt,
          endsAt: event.endsAt,
          title: event.title,
          place: event.location?.name,
          href: `/aktiviteter/${event._id}`,
        },
    ),
    ...sessionSeries.flatMap((series) =>
      (series.sessions ?? []).map(
        (session) =>
          session.startsAt && {
            id: session._key,
            startsAt: session.startsAt,
            endsAt: session.endsAt,
            title: series.title,
            place: series.location?.name,
            href: `/aktiviteter/${series.slug?.current ?? series._id}`,
            cancelled: session.cancelled,
            note: session.note,
          },
      ),
    ),
  ])
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    )
    .slice(0, limit);

  const byDay = group(entries, (entry) =>
    formatNorwegianDate(entry.startsAt, "yyyy-MM-dd"),
  );
  return sift(Object.values(byDay));
};

const Timeline = ({
  days,
  dayHeadingAs,
  hideTitles,
}: {
  days: CalendarEntry[][];
  dayHeadingAs: "h2" | "h3";
  hideTitles?: boolean;
}) => (
  <Box position="relative">
    {/* Streken går midt gjennom datobrikkene */}
    <Box
      position="absolute"
      top="1rem"
      bottom="1rem"
      left={{ base: "calc(2rem - 1px)", md: "calc(2.75rem - 1px)" }}
      width="2px"
      background="ink/15"
      aria-hidden="true"
    />
    <Stack gap="1rem">
      {days.map((entries) => (
        <Flex
          key={entries[0].id}
          position="relative"
          align="flex-start"
          gap={{ base: "1rem", md: "1.5rem" }}
        >
          <DatePill date={entries[0].startsAt} as={dayHeadingAs} />
          <Stack gap=".5rem" align="flex-start" flex="1" minWidth="0">
            {entries.map((entry) => (
              <CalendarCard key={entry.id} {...entry} hideTitle={hideTitles} />
            ))}
          </Stack>
        </Flex>
      ))}
    </Stack>
  </Box>
);

const DatePill = ({ date, as }: { date: string; as: "h2" | "h3" }) => (
  <Heading
    as={as}
    display="flex"
    flexDirection="column"
    alignItems="center"
    flexShrink={0}
    width={{ base: "4rem", md: "5.5rem" }}
    paddingY=".75rem"
    background="arctic.base"
    color="aurora.green"
    fontFamily="body"
    fontSize="sm"
    fontWeight="bold"
    lineHeight={1.25}
    letterSpacing="wider"
  >
    <Box srOnly>{formatNorwegianDate(date, "EEEE d. MMMM")}</Box>
    <span aria-hidden="true">{formatNorwegianAbbreviation(date, "EEE")}</span>
    <Box
      as="span"
      aria-hidden="true"
      fontSize="3xl"
      fontWeight="extrabold"
      lineHeight={1}
      letterSpacing="normal"
      color="onDark.base"
    >
      {formatNorwegianDate(date, "d")}
    </Box>
    <span aria-hidden="true">{formatNorwegianAbbreviation(date, "MMM")}</span>
  </Heading>
);

const EmptyState = () => (
  <Stack background="card.base" padding="1.5rem" gap=".5rem" align="flex-start">
    <Text fontWeight="bold" fontSize="lg">
      Ingen planlagte aktiviteter akkurat nå
    </Text>
    <Text fontSize="sm" color="muted">
      {noSessionsYet}
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

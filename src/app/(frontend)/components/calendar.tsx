import { Kicker } from "@/components/Kicker";
import { sanityFetch } from "@/sanity/lib/client";
import { resolveSport } from "@/sanity/sports";
import { formatNorwegianDate } from "@/utils/date";
import { Box, Flex, FlexProps, Grid, Stack, Text } from "@chakra-ui/react";
import { startOfDay } from "date-fns";
import { defineQuery } from "next-sanity";
import Link from "next/link";
import { group } from "radash";
import { ActivitiesQueryResult } from "../../../../sanity.types";
import { CalendarCard } from "./CalendarCard";

/**
 * Både filtrering på tid og valg av felter skjer i GROQ. Et `...`-spread hentet
 * tidligere hver eneste sesjon på hver eneste serie (~500 objekter, 150 kB) og
 * all fritekst, for så å kaste nesten alt i JavaScript.
 */
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
    sport,
    startsAt,
    endsAt,
    "image": images[0],
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
    sport,
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

/**
 * Når komponenten viser `limit` rader kan ingen enkelt serie bidra med mer enn
 * `limit` av dem, så det er trygt å kutte per serie allerede i spørringen.
 * Uten limit (feks /kalender) trengs alle — taket er da satt langt over det en
 * sesong noen gang inneholder.
 */
const NO_SESSION_LIMIT = 1000;

type Props = {
  limit?: number;
  seriesId?: string;
  locationId?: string;
  heading?: string;
  clubId?: string;
  /** Aktiviteter som allerede vises et annet sted på siden og ikke skal gjentas her */
  excludeIds?: string[];
  /** «timeline» har datoskinne til venstre, «grid» er kompakte rader i to kolonner */
  variant?: "timeline" | "grid";
  /** Av på en aktivitets egen side, der hver rad ellers gjentar samme tittel */
  showTitles?: boolean;
  childrenAfter?: React.ReactNode;
};

type SessionSeries = ActivitiesQueryResult["sessionSeries"][number];

/** Én forekomst av en fast aktivitet, med serien den hører til. */
export type SessionOccurrence = NonNullable<
  SessionSeries["sessions"]
>[number] & {
  _type: "session";
  series: SessionSeries;
};

export const Calendar = async (props: Props) => {
  const variant = props.variant ?? "timeline";
  const { events, sessionSeries } = await sanityFetch(activitiesQuery, {
    seriesId: props.seriesId ?? null,
    locationId: props.locationId ?? null,
    clubId: props.clubId ?? null,
    sessionLimit: props.limit ?? NO_SESSION_LIMIT,
  });

  const excluded = new Set(props.excludeIds ?? []);

  // Tidsfiltrering er allerede gjort i GROQ; her flates seriene ut til
  // enkeltforekomster. `_type` settes for å skille dem fra arrangementer.
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

  const heading = props.heading && <Kicker as="h2">{props.heading}</Kicker>;

  if (entries.length === 0)
    return (
      <Stack gap="1rem" alignItems="stretch">
        {heading}
        <EmptyState />
      </Stack>
    );

  const cardFor = (
    item: (typeof sortedEventsAndSessions)[number],
    key: string,
  ) =>
    item._type === "event" ? (
      <CalendarCard
        key={key}
        startsAt={item.startsAt}
        endsAt={item.endsAt}
        title={item.title}
        location={item.location}
        slug={item._id}
        image={item.image}
        sport={resolveSport(item)}
        type="event"
      />
    ) : (
      <CalendarCard
        key={key}
        startsAt={item.startsAt}
        endsAt={item.endsAt}
        title={item.series.title}
        location={item.series.location}
        slug={item.series.slug?.current}
        cancelled={item.cancelled}
        note={item.note}
        sport={resolveSport(item.series)}
        hideTitle={props.showTitles === false}
        type="session"
      />
    );

  // Kompakt variant: ingen datoskinne, datoen får en egen brikke foran hvert kort
  if (variant === "grid")
    return (
      <Stack gap="1.25rem">
        {heading}
        <Grid
          gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap=".875rem"
          alignItems="start"
        >
          {sortedEventsAndSessions.map((item) => {
            const key = item._type === "event" ? item._id : item._key;
            return (
              <Flex key={key} gap=".875rem" alignItems="center">
                <DatoBadge date={item.startsAt!} flexShrink={0} />
                {cardFor(item, key)}
              </Flex>
            );
          })}
        </Grid>
        {props.childrenAfter}
      </Stack>
    );

  return (
    <Stack gap="1.25rem">
      {heading}
      <Stack gap="0">
        {entries.map(([date, activities], index) => {
          const isLast = index === entries.length - 1;
          return (
            <Flex key={date} gap=".875rem" align="stretch">
              {/* Datoskinne: brikke øverst, tynn strek ned til neste dato */}
              <Flex
                direction="column"
                align="center"
                width={{ base: "2.75rem", sm: "3.5rem" }}
                flexShrink={0}
              >
                <DatoBadge date={date} position="sticky" top="5.5rem" />
                {!isLast && (
                  <Box
                    width="0.125rem"
                    flex="1"
                    background="hairline"
                    marginTop=".25rem"
                  />
                )}
              </Flex>
              <Stack
                gap=".5rem"
                flex="1"
                minWidth="0"
                paddingBottom={isLast ? "0" : ".875rem"}
              >
                {activities?.map((item) =>
                  cardFor(item, item._type === "event" ? item._id : item._key),
                )}
              </Stack>
            </Flex>
          );
        })}
      </Stack>
      {props.childrenAfter}
    </Stack>
  );
};

/**
 * Klubben har lange perioder mellom sesongene der ingenting er planlagt, så dette
 * er en tilstand forsiden faktisk står i — ikke en kant-case.
 */
const EmptyState = () => (
  <Stack
    background="surface"
    border="1px solid"
    borderColor="hairline"
    borderRadius="xl"
    padding="1.5rem"
    gap=".5rem"
    alignItems="flex-start"
  >
    <Text fontWeight={700} color="forest.700">
      Ingen planlagte aktiviteter akkurat nå
    </Text>
    <Text fontSize="0.85rem" color="muted">
      Treningstidene legges ut så snart sesongen er satt.
    </Text>
    <Box
      asChild
      fontSize="0.8rem"
      fontWeight={700}
      color="amber.700"
      _hover={{ textDecoration: "underline" }}
    >
      <Link href="/faste-aktiviteter">Se alle faste tilbud →</Link>
    </Box>
  </Stack>
);

export const DatoBadge = ({
  date,
  ...chakraProps
}: { date: string } & FlexProps) => (
  <Flex
    flexDirection="column"
    as="p"
    padding=".45rem .6rem"
    minWidth={{ base: "2.75rem", sm: "3.5rem" }}
    textAlign="center"
    alignItems="center"
    borderRadius="lg"
    background="forest.700"
    color="onDark"
    lineHeight={1}
    title={formatNorwegianDate(date, "PPP")}
    {...chakraProps}
  >
    <Box
      as="span"
      fontSize="0.6rem"
      fontWeight={700}
      opacity={0.75}
      textTransform="uppercase"
    >
      {formatNorwegianDate(date, "E")}
    </Box>
    <Box
      as="span"
      fontFamily="heading"
      fontWeight={800}
      fontSize="1.25rem"
      marginY=".1rem"
    >
      {formatNorwegianDate(date, "d")}
    </Box>
    <Box
      as="span"
      fontSize="0.62rem"
      fontWeight={700}
      opacity={0.85}
      textTransform="uppercase"
    >
      {formatNorwegianDate(date, "MMM").replace(".", "")}
    </Box>
  </Flex>
);

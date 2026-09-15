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
  /** Av på en aktivitets egen side, der hver rad ellers gjentar samme tittel */
  showTitles?: boolean;
  /**
   * Hva lista gjør når den er tom:
   *  - «card» (standard): tomkortet med lenke videre til alle faste tilbud
   *  - «note»: bare en linje tekst. Til lister som står på en aktivitets egen side,
   *    der lenka ville pekt tilbake dit du allerede er
   *  - «hide»: seksjonen droppes helt. Til lister som bare utfyller hovedinnholdet,
   *    så en side ikke ender opp med det samme tomkortet to ganger
   */
  whenEmpty?: "card" | "note" | "hide";
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

/** Datobrikka er smalere på mobil, så radene ved siden av får plass til navnene */
const pillWidth = { base: "4rem", md: "5.5rem" };

export const Calendar = async (props: Props) => {
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
          <Text fontSize="0.9375rem" color="muted">
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
        {/* Streken tidslinja henger på, midt gjennom datobrikkene */}
        <Box
          position="absolute"
          top="1rem"
          bottom="1rem"
          left={{ base: "calc(2rem - 1px)", md: "calc(2.75rem - 1px)" }}
          width="2px"
          background="hairline"
          aria-hidden="true"
        />
        <Stack gap=".875rem">
          {entries.map(([date, activities]) => (
            <Flex
              key={date}
              position="relative"
              align="flex-start"
              gap={{ base: ".875rem", md: "1.625rem" }}
            >
              {/* Under en seksjonsoverskrift er datoen et nivå ned; på /kalender står den alene */}
              <DatePill date={date} as={props.heading ? "h3" : "h2"} />
              <Stack gap=".625rem" align="flex-start" flex="1" minWidth="0">
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
                      hideTitle={props.showTitles === false}
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

/**
 * Datoen i tidslinja: ukedag, dag og måned i en mørk brikke på streken. Skjermlesere
 * får datoen skrevet ut i stedet for forkortelsene.
 */
const DatePill = ({ date, as }: { date: string; as: "h2" | "h3" }) => (
  <Heading
    as={as}
    display="flex"
    flexDirection="column"
    alignItems="center"
    flexShrink={0}
    width={pillWidth}
    padding=".6875rem 0 .8125rem"
    background="arctic.base"
    fontFamily="body"
    lineHeight={1.15}
  >
    <Box srOnly>{formatNorwegianDate(date, "EEEE d. MMMM")}</Box>
    <Box
      as="span"
      aria-hidden="true"
      fontSize="0.8125rem"
      fontWeight={700}
      letterSpacing=".04em"
      color="aurora.green"
    >
      {formatNorwegianDate(date, "EEE").replace(".", "")}
    </Box>
    <Box
      as="span"
      aria-hidden="true"
      fontSize="1.875rem"
      fontWeight={800}
      lineHeight={1}
      margin=".0625rem 0 .125rem"
      color="onDark.base"
    >
      {formatNorwegianDate(date, "d")}
    </Box>
    <Box
      as="span"
      aria-hidden="true"
      fontSize="0.8125rem"
      fontWeight={700}
      letterSpacing=".04em"
      color="aurora.green"
    >
      {formatNorwegianDate(date, "MMM").replace(".", "")}
    </Box>
  </Heading>
);

/**
 * Klubben har lange perioder mellom sesongene der ingenting er planlagt, så dette
 * er en tilstand forsiden faktisk står i — ikke en kant-case.
 */
const EmptyState = () => (
  <Stack
    background="card.base"
    padding="1.625rem"
    gap=".5rem"
    align="flex-start"
  >
    <Text fontWeight={700} fontSize="1.0625rem" color="ink">
      Ingen planlagte aktiviteter akkurat nå
    </Text>
    <Text fontSize="0.8125rem" color="muted">
      Treningstidene legges ut så snart sesongen er satt.
    </Text>
    <Box
      asChild
      textStyle="kicker"
      color="deep.base"
      marginTop=".375rem"
      _hover={{ color: "deep.hover" }}
    >
      <Link href="/faste-aktiviteter">Se alle faste tilbud →</Link>
    </Box>
  </Stack>
);

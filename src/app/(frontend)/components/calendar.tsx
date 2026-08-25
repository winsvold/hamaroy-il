import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { formatNorwegianDate } from "@/utils/date";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
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

/**
 * Prikkene roterer med posisjonen i lista, ikke med idretten. Slik gjør prototypen
 * det også — samme aktivitet får ulik farge på forsiden og på en aktivitetsside.
 * Å binde fargene til idrett ville antydet et system paletten ikke kan bære: den har
 * tre farger og klubben seks idretter.
 */
const dotColors = ["aurora.green", "aurora.teal", "aurora.violet"];

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

  // Teller på tvers av datogruppene, slik at fargene roterer nedover hele lista
  let rowIndex = 0;

  return (
    // Samme bredde som kolonnen lista står i på forsiden. Uten taket strekker radene
    // seg over hele sidebredden på /kalender, med en tom halvdel til høyre.
    <Box maxWidth="40rem">
      {heading}
      {entries.map(([date, activities], index) => (
        <Flex
          key={date}
          gap="1.375rem"
          paddingTop="1rem"
          marginTop={index === 0 ? "0" : "1.375rem"}
          // Første gruppe får den tunge streken, resten en hårstrek — som i designet
          borderTop={index === 0 ? "2px solid" : "1px solid"}
          borderColor={index === 0 ? "arctic.ink" : "hairline"}
        >
          <Box width="3.875rem" flexShrink={0}>
            <Box
              fontFamily="heading"
              fontWeight={800}
              fontSize="1.875rem"
              lineHeight={1}
              color="ink"
              title={formatNorwegianDate(date, "PPP")}
            >
              {formatNorwegianDate(date, "d")}
            </Box>
            {/* Forkortet: «november» og «september» brekker over to linjer i en
                kolonne på 3.875rem. Designet traff bare korte måneder. */}
            <Box
              textStyle="kicker"
              color="muted"
              marginTop=".1875rem"
              whiteSpace="nowrap"
            >
              {formatNorwegianDate(date, "MMM").replace(".", "")}
            </Box>
          </Box>
          <Stack gap=".875rem" flex="1" minWidth="0">
            {activities?.map((item) => {
              const dotColor = dotColors[rowIndex++ % dotColors.length];
              return item._type === "event" ? (
                <CalendarCard
                  key={item._id}
                  startsAt={item.startsAt}
                  endsAt={item.endsAt}
                  title={item.title}
                  location={item.location}
                  slug={item._id}
                  dotColor={dotColor}
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
                  dotColor={dotColor}
                  hideTitle={props.showTitles === false}
                />
              );
            })}
          </Stack>
        </Flex>
      ))}
      {props.childrenAfter}
    </Box>
  );
};

/** Den mørke handlingsstripa under en liste. */
export const CalendarActionBar = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Box
    asChild
    textStyle="kicker"
    display="flex"
    alignItems="center"
    justifyContent="center"
    gap=".5rem"
    marginTop="1.625rem"
    padding=".9375rem"
    background="arctic.base"
    color="aurora.green"
    transition="background .2s, color .2s"
    _hover={{ background: "arctic.hover", color: "aurora.teal" }}
  >
    <Link href={href}>{children}</Link>
  </Box>
);

/**
 * Klubben har lange perioder mellom sesongene der ingenting er planlagt, så dette
 * er en tilstand forsiden faktisk står i — ikke en kant-case.
 */
const EmptyState = () => (
  <Stack
    background="sage.base"
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

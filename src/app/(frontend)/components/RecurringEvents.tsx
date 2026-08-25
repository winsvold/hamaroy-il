import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { resolveSport, Sport, sports } from "@/sanity/sports";
import { formatNorwegianDate } from "@/utils/date";
import { Box, Flex, Grid, Heading, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Link from "next/link";
import { ReoccurringEventsQueryResult } from "../../../../sanity.types";

const reoccurringEventsQuery = defineQuery(`{
  "sessionSeries": *[
    _type == "sessionSeries"
  ]
  {
    _id,
    title,
    slug,
    sport,
    "sessions": sessions[] {
      "startsAt": dateTime(startsAt),
      "endsAt": dateTime(startsAt) + duration.hours * 60 * 60 + duration.minutes * 60,
    } [defined(startsAt) && dateTime(endsAt) > dateTime(now())] | order(startsAt asc) [0...1],
  } | order(title asc),
}`);

type Series = ReoccurringEventsQueryResult["sessionSeries"][number];

const ActivityRow = ({
  series,
  fontSize,
}: {
  series: Series;
  fontSize: string;
}) => {
  const nextOccurrence = series.sessions?.[0]?.startsAt;

  return (
    <Flex
      asChild
      align="baseline"
      justify="space-between"
      gap=".875rem"
      paddingY=".8125rem"
      borderBottom="1px solid"
      borderColor="hairline"
      _hover={{ "& > span:first-of-type": { color: "deep.base" } }}
    >
      <Link href={`/aktiviteter/${series.slug?.current ?? series._id}`}>
        <Box
          as="span"
          fontWeight={600}
          fontSize={fontSize}
          color="ink"
          transition="color .2s"
        >
          {series.title}
        </Box>
        {/*
          Designet viste «Ikke planlagt» på alle rader fordi prototypen ikke hadde data.
          Her står den faktiske neste treningen når det finnes en — forkortet, siden
          merkelappen deler linje med et aktivitetsnavn som kan bli langt.
        */}
        <Box
          as="span"
          textStyle="kicker"
          letterSpacing=".13em"
          flexShrink={0}
          color={nextOccurrence ? "deep.base" : "muted"}
        >
          {nextOccurrence
            ? `Neste: ${formatNorwegianDate(nextOccurrence, "d. MMM").replace(".", "")}`
            : "Ikke planlagt"}
        </Box>
      </Link>
    </Flex>
  );
};

const SportSection = ({
  sport,
  series,
  headingAs,
  fontSize,
}: {
  sport?: Sport;
  series: Series[];
  headingAs: "h2" | "h3";
  fontSize: string;
}) => (
  <Box as="section" id={sport?.id} scrollMarginTop="6rem">
    <Heading
      as={headingAs}
      textStyle="kicker"
      color="deep.base"
      paddingBottom=".625rem"
      borderBottom="2px solid"
      borderColor="arctic.ink"
    >
      {sport?.title ?? "Andre aktiviteter"}
    </Heading>
    <Stack gap="0">
      {series.map((item) => (
        <ActivityRow key={item._id} series={item} fontSize={fontSize} />
      ))}
    </Stack>
  </Box>
);

type Props = {
  /**
   * Settes når lista står som en seksjon inne i en annen side (forsiden). Da får
   * seksjonen sin egen overskrift, og idrettene skyves ett nivå ned.
   */
  heading?: string;
};

export const RecurringEvents = async (props: Props) => {
  const { sessionSeries } = await sanityFetch(reoccurringEventsQuery);

  // Grupperer på idrett, i rekkefølgen sports.ts definerer. Serier uten treff
  // havner i en «Andre aktiviteter»-bolk til slutt.
  const bySport = sports
    .map((sport) => ({
      sport,
      series: sessionSeries.filter(
        (item) => resolveSport(item)?.id === sport.id,
      ),
    }))
    .filter((section) => section.series.length > 0);

  const ungrouped = sessionSeries.filter((item) => !resolveSport(item));

  if (!bySport.length && !ungrouped.length) return null;

  // På sin egen side får lista litt mer luft og større radtekst enn på forsiden
  const embedded = !!props.heading;
  const minColumn = embedded ? "18.75rem" : "20rem";
  const fontSize = embedded ? "0.9375rem" : "1rem";

  return (
    <Box id="faste-aktiviteter" scrollMarginTop="6rem">
      {props.heading && (
        <SectionHeading marginBottom="1.5rem">{props.heading}</SectionHeading>
      )}
      <Grid
        gridTemplateColumns={`repeat(auto-fit, minmax(min(${minColumn}, 100%), 1fr))`}
        gap={embedded ? "2.25rem 2.75rem" : "2.5rem 3rem"}
        alignItems="start"
      >
        {bySport.map(({ sport, series }) => (
          <SportSection
            key={sport.id}
            sport={sport}
            series={series}
            headingAs={embedded ? "h3" : "h2"}
            fontSize={fontSize}
          />
        ))}
        {!!ungrouped.length && (
          <SportSection
            series={ungrouped}
            headingAs={embedded ? "h3" : "h2"}
            fontSize={fontSize}
          />
        )}
      </Grid>
    </Box>
  );
};

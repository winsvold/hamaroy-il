import { CardGrid } from "@/components/CardGrid";
import { RuledHeading } from "@/components/RuledHeading";
import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { resolveSport, Sport, sports } from "@/sanity/sports";
import { formatNorwegianDate } from "@/utils/date";
import { Box, Stack } from "@chakra-ui/react";
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

const ActivityCard = ({ series }: { series: Series }) => {
  const nextOccurrence = series.sessions?.[0]?.startsAt;

  return (
    <Stack
      asChild
      gap=".4375rem"
      background="card.base"
      padding={{ base: "1rem 1.125rem", md: "1.25rem 1.375rem" }}
      transition="background .2s"
      _hover={{
        background: "card.hover",
        "& > span:first-of-type": { color: "deep.base" },
      }}
    >
      <Link href={`/aktiviteter/${series.slug?.current ?? series._id}`}>
        <Box
          as="span"
          fontWeight={700}
          fontSize="1.0625rem"
          lineHeight={1.32}
          color="ink"
          transition="color .2s"
        >
          {series.title}
        </Box>
        <Box
          as="span"
          fontSize="0.875rem"
          fontWeight={500}
          color="muted"
          fontStyle={nextOccurrence ? undefined : "italic"}
        >
          {nextOccurrence
            ? `Neste: ${formatNorwegianDate(nextOccurrence, "EEEE d MMM p")}`
            : "Ikke planlagt"}
        </Box>
      </Link>
    </Stack>
  );
};

const SportSection = ({
  sport,
  series,
  headingAs,
}: {
  sport?: Sport;
  series: Series[];
  headingAs: "h2" | "h3";
}) => (
  <Box as="section" id={sport?.id} scrollMarginTop="6rem">
    <RuledHeading as={headingAs} rule="light" color="deep.base">
      {sport?.title ?? "Andre aktiviteter"}
    </RuledHeading>
    <CardGrid>
      {series.map((item) => (
        <ActivityCard key={item._id} series={item} />
      ))}
    </CardGrid>
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

  const headingAs = props.heading ? "h3" : "h2";

  return (
    <Box id="faste-aktiviteter" scrollMarginTop="6rem">
      {props.heading && (
        <SectionHeading marginBottom="1.5rem">{props.heading}</SectionHeading>
      )}
      <Stack gap="1.625rem">
        {bySport.map(({ sport, series }) => (
          <SportSection
            key={sport.id}
            sport={sport}
            series={series}
            headingAs={headingAs}
          />
        ))}
        {!!ungrouped.length && (
          <SportSection series={ungrouped} headingAs={headingAs} />
        )}
      </Stack>
    </Box>
  );
};

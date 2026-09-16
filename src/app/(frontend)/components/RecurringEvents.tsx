import { CardGrid } from "@/components/CardGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { resolveSport, Sport, sports } from "@/sanity/sports";
import { formatNorwegianDate } from "@/utils/date";
import { Box, Heading, Stack } from "@chakra-ui/react";
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
      gap=".5rem"
      background="card.base"
      padding={{ base: "1rem", md: "1.25rem 1.5rem" }}
      transition="background .2s"
      _hover={{
        background: "card.hover",
        "& > span:first-of-type": { color: "deep.base" },
      }}
    >
      <Link href={`/aktiviteter/${series.slug?.current ?? series._id}`}>
        <Box
          as="span"
          fontWeight="bold"
          fontSize="lg"
          lineHeight={1.25}
          color="ink"
          transition="color .2s"
        >
          {series.title}
        </Box>
        <Box
          as="span"
          fontSize="sm"
          fontWeight="medium"
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
  <Box as="section" id={sport?.id}>
    <Heading
      as={headingAs}
      fontFamily="heading"
      fontWeight="bold"
      fontSize="xl"
      lineHeight={1.25}
      color="deep.base"
      marginBottom="1rem"
    >
      {sport?.title ?? "Andre aktiviteter"}
    </Heading>
    <CardGrid>
      {series.map((item) => (
        <ActivityCard key={item._id} series={item} />
      ))}
    </CardGrid>
  </Box>
);

type Props = {
  /** Egen overskrift når lista står inne i en annen side */
  heading?: string;
};

export const RecurringEvents = async (props: Props) => {
  const { sessionSeries } = await sanityFetch(reoccurringEventsQuery);

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
    <Box id="faste-aktiviteter">
      {props.heading && (
        <SectionHeading marginBottom="1.5rem">{props.heading}</SectionHeading>
      )}
      <Stack gap="1.5rem">
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

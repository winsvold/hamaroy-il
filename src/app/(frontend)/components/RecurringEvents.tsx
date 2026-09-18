import { CardGrid } from "@/components/CardGrid";
import { LinkCard, LinkCardTitle } from "@/components/LinkCard";
import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { sessionTimes, upcomingFirst } from "@/sanity/lib/sessions";
import { getSport, sports } from "@/sanity/sports";
import { formatNorwegianDate } from "@/utils/date";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import { group } from "radash";
import { RecurringEventsQueryResult } from "../../../../sanity.types";

const recurringEventsQuery =
  defineQuery(`*[_type == "sessionSeries"] | order(title asc) {
  _id,
  title,
  slug,
  sport,
  "nextStartsAt": sessions[cancelled != true] { ${sessionTimes} } ${upcomingFirst} [0].startsAt,
}`);

type Series = RecurringEventsQueryResult[number];

type Props = {
  /** Egen overskrift når lista står inne i en annen side */
  heading?: string;
};

export const RecurringEvents = async ({ heading }: Props) => {
  const sections = groupBySport(await sanityFetch(recurringEventsQuery));
  if (!sections.length) return null;

  return (
    <Box as="section" id="faste-aktiviteter">
      {heading && <SectionHeading>{heading}</SectionHeading>}
      <Stack gap="1.5rem">
        {sections.map((section) => (
          <Box as="section" key={section.id} id={section.id}>
            <Heading
              as={heading ? "h3" : "h2"}
              fontWeight="bold"
              fontSize="xl"
              lineHeight={1.25}
              color="deep.base"
              marginBottom="1rem"
            >
              {section.title}
            </Heading>
            <CardGrid>
              {section.series.map((item) => (
                <SeriesCard key={item._id} series={item} />
              ))}
            </CardGrid>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

/** Grupperer på idrett i rekkefølgen fra sports.ts, med resten til slutt */
const groupBySport = (series: Series[]) => {
  const bySport = group(series, (item) => getSport(item.sport)?.id ?? "andre");

  return [...sports, { id: "andre", title: "Andre aktiviteter" }]
    .map(({ id, title }) => ({ id, title, series: bySport[id] ?? [] }))
    .filter((section) => section.series.length);
};

const SeriesCard = ({ series }: { series: Series }) => (
  <LinkCard padding={{ base: "1rem", md: "1.25rem 1.5rem" }}>
    <LinkCardTitle
      as="p"
      href={`/aktiviteter/${series.slug?.current ?? series._id}`}
      fontSize="lg"
    >
      {series.title}
    </LinkCardTitle>
    <Text
      fontSize="sm"
      fontWeight="medium"
      color="muted"
      fontStyle={series.nextStartsAt ? undefined : "italic"}
      marginTop=".5rem"
    >
      {series.nextStartsAt
        ? `Neste: ${formatNorwegianDate(series.nextStartsAt, "EEEE d MMM p")}`
        : "Ikke planlagt"}
    </Text>
  </LinkCard>
);

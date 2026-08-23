import { Kicker } from "@/components/Kicker";
import { sanityFetch } from "@/sanity/lib/client";
import { resolveSport, Sport, sports } from "@/sanity/sports";
import { formatNorwegianDate } from "@/utils/date";
import {
  Box,
  Grid,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
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
    images,
    sessions[] {
      ...,
      "startsAt": dateTime(startsAt),
      "endsAt": dateTime(startsAt) + duration.hours * 60 * 60 + duration.minutes * 60,
    } [defined(startsAt) && dateTime(endsAt) > dateTime(now())] | order(startsAt asc) [0...1],
    location->,
    organizers[]->,
  } | order(title asc),
}`);

type Series = ReoccurringEventsQueryResult["sessionSeries"][number];

const ActivityCard = ({
  series,
  headingAs,
}: {
  series: Series;
  headingAs: "h3" | "h4";
}) => {
  const nextOccurrence = series.sessions?.[0]?.startsAt ?? undefined;

  return (
    <LinkBox
      display="flex"
      flexDirection="column"
      gap=".65rem"
      background="surface"
      border="1px solid"
      borderColor="hairline"
      borderRadius="2xl"
      padding="1.25rem"
      transition="border-color .2s"
      _hover={{ borderColor: "hairlineStrong" }}
    >
      <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
        <Link href={`/aktiviteter/${series.slug?.current ?? series._id}`}>
          <Heading
            as={headingAs}
            fontFamily="body"
            fontWeight={700}
            fontSize="0.97rem"
            lineHeight={1.35}
            color="forest.700"
          >
            {series.title}
          </Heading>
        </Link>
      </LinkOverlay>
      {/*
        Designet viste «Ikke planlagt» på alle kort fordi prototypen ikke hadde data.
        Her vises den faktiske neste treningen når det finnes en.
      */}
      <Box
        alignSelf="flex-start"
        fontSize="0.66rem"
        fontWeight={700}
        letterSpacing=".04em"
        textTransform="uppercase"
        borderRadius="lg"
        padding=".25rem .6rem"
        background={nextOccurrence ? "amber.50" : "forest.50"}
        color={nextOccurrence ? "amber.700" : "muted"}
      >
        {nextOccurrence
          ? `Neste: ${formatNorwegianDate(nextOccurrence, "EEE d. MMM p")}`
          : "Ikke planlagt"}
      </Box>
      <Text
        marginTop="auto"
        fontSize="0.78rem"
        fontWeight={700}
        color="amber.700"
      >
        Se detaljer →
      </Text>
    </LinkBox>
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
  <Stack gap="1rem" as="section" id={sport?.id} scrollMarginTop="6rem">
    <Kicker
      as={headingAs}
      display="flex"
      alignItems="center"
      gap=".5rem"
      fontSize="0.7rem"
      color={sport?.accent === "amber" ? "amber.700" : "forest.700"}
    >
      {sport && (
        <Box fontSize="1.125rem" aria-hidden="true">
          {sport.emoji}
        </Box>
      )}
      {sport?.title ?? "Andre aktiviteter"}
    </Kicker>
    <Grid
      gridTemplateColumns="repeat(auto-fill, minmax(min(17rem, 100%), 1fr))"
      gap=".875rem"
      alignItems="stretch"
    >
      {series.map((item) => (
        <ActivityCard
          key={item._id}
          series={item}
          headingAs={headingAs === "h2" ? "h3" : "h4"}
        />
      ))}
    </Grid>
  </Stack>
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
    <Stack gap="1.75rem" id="faste-aktiviteter" scrollMarginTop="6rem">
      {props.heading && <Kicker as="h2">{props.heading}</Kicker>}
      <Stack gap="2.75rem">
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
    </Stack>
  );
};

import { DefaultContainer } from "@/components/DefaultContainer";
import { Kicker } from "@/components/Kicker";
import { PageIntro } from "@/components/PageIntro";
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

const ActivityCard = ({ series }: { series: Series }) => {
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
            as="h3"
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
}: {
  sport?: Sport;
  series: Series[];
}) => (
  <Stack gap="1rem" as="section" id={sport?.id} scrollMarginTop="6rem">
    <Kicker
      as="h2"
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
        <ActivityCard key={item._id} series={item} />
      ))}
    </Grid>
  </Stack>
);

export const RecurringEvents = async () => {
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

  return (
    <Stack gap="2.75rem">
      {bySport.map(({ sport, series }) => (
        <SportSection key={sport.id} sport={sport} series={series} />
      ))}
      {!!ungrouped.length && <SportSection series={ungrouped} />}
    </Stack>
  );
};

const Page = () => (
  <DefaultContainer paddingTop={{ base: "2rem", md: "3.5rem" }}>
    <Stack gap="2.5rem">
      <PageIntro
        kicker="Faste aktiviteter"
        title="Alle faste treningstilbud i Hamarøy IL"
        text="Oversikt over faste grupper og aldersinndelte tilbud på tvers av klubbene. Trykk på en aktivitet for treningstider og sted."
      />
      <RecurringEvents />
    </Stack>
  </DefaultContainer>
);

export default Page;

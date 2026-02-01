import { DefaultContainer } from "@/components/DefaultContainer";
import { sanityFetch } from "@/sanity/lib/client";
import { formatNorwegianDate } from "@/utils/date";
import {
  Grid,
  Heading,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { defineQuery } from "next-sanity";

const reoccurringEventsQuery = defineQuery(`{
  "sessionSeries": *[
    _type == "sessionSeries"
  ]
  {
    _id,
    title,
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

export const RecurringEvents = async () => {
  const { sessionSeries } = await sanityFetch(reoccurringEventsQuery);

  return (
    <Stack>
      <Heading as="h1">Faste aktiviteter</Heading>
      <Grid
        gridTemplateColumns="repeat(auto-fill, minmax(20rem, 1fr))"
        gap=".75rem"
      >
        {sessionSeries.map((series) => {
          const nextOccurrence =
            // @ts-expect-error for some reason sessions[0] becomes type 'never'
            series.sessions?.[0]?.startsAt;
          return (
            <LinkBox
              borderRadius="md"
              backgroundColor="green.100"
              _hover={{
                backgroundColor: "green.200",
              }}
              transition=".3s"
              overflow="hidden"
              key={series._id}
              padding=".75rem"
            >
              <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
                <Link href={`/aktiviteter/${series._id}`}>
                  <Heading size="md">{series.title}</Heading>
                </Link>
              </LinkOverlay>
              <Text>
                {nextOccurrence
                  ? `Neste: ${formatNorwegianDate(nextOccurrence, "EEEE d MMM p")}`
                  : "Ikke planlagt"}
              </Text>
            </LinkBox>
          );
        })}
      </Grid>
    </Stack>
  );
};

const Page = () => (
  <DefaultContainer>
    <RecurringEvents />
  </DefaultContainer>
);

export default Page;

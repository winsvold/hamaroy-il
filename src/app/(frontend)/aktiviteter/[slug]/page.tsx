import { Avatar } from "@/components/Avatar";
import { CallToAction } from "@/components/CallToAction";
import { DefaultContainer } from "@/components/DefaultContainer";
import { VippsIkon } from "@/components/ikoner/vipps";
import { ImageGallery } from "@/components/ImageGallery";
import { Kicker } from "@/components/Kicker";
import { LocationCard } from "@/components/Location";
import { RichText } from "@/components/RichText";
import { SectionHeading } from "@/components/SectionHeading";
import { sanityFetch } from "@/sanity/lib/client";
import { resolveSport } from "@/sanity/sports";
import {
  formatNorwegianDateCapitalized,
  formatNorwegianTimeRange,
} from "@/utils/date";
import { getSessionEndsAt } from "@/utils/session";
import { Box, Flex, Grid, Heading, Icon, Stack, Text } from "@chakra-ui/react";
import { isAfter } from "date-fns";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { AktivitetQueryResult } from "../../../../../sanity.types";
import { Calendar } from "../../components/calendar";
import { PageHero } from "../../layout/PageHero";

const aktivitetQuery =
  defineQuery(`*[_type in ["sessionSeries", "event"] && (slug.current == $slug || _id == $slug)][0]{
  ...,
  location->,
  organizers[]->,
}`);

type Props = {
  params: Promise<{ slug: string }>;
};

type Aktivitet = NonNullable<AktivitetQueryResult>;

const getFacts = (data: Aktivitet) => {
  const place = data.location?.name;

  if (data._type === "event")
    return [
      {
        label: "Dato",
        value: formatNorwegianDateCapitalized(data.startsAt, "EEEE d. MMMM y"),
      },
      {
        label: "Tid",
        value: formatNorwegianTimeRange(data.startsAt, data.endsAt),
      },
      place && { label: "Sted", value: place },
    ];

  const next = data.sessions
    ?.filter(
      (session) =>
        session.startsAt &&
        session.duration &&
        isAfter(getSessionEndsAt(session), new Date()),
    )
    .sort(
      (a, b) =>
        new Date(a.startsAt!).getTime() - new Date(b.startsAt!).getTime(),
    )[0];

  return [
    {
      label: "Neste gang",
      value: next
        ? formatNorwegianDateCapitalized(next.startsAt, "EEEE d. MMMM")
        : "Ikke planlagt",
    },
    next && {
      label: "Tid",
      value: formatNorwegianTimeRange(next.startsAt, getSessionEndsAt(next)),
    },
    place && { label: "Sted", value: place },
  ];
};

const Page = async (props: Props) => {
  const params = await props.params;
  const data = await sanityFetch(aktivitetQuery, { slug: params.slug });

  if (!data) return notFound();

  const sport = resolveSport(data);
  const isEvent = data._type === "event";
  const facts = getFacts(data).filter((fact) => !!fact);

  return (
    <>
      <PageHero variant="detail">
        <Stack gap="0" maxWidth="50rem">
          {sport && (
            <Kicker color="aurora.green" marginBottom="1rem">
              {sport.title}
            </Kicker>
          )}
          <Heading
            as="h1"
            fontFamily="heading"
            fontWeight="extrabold"
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
            lineHeight={1}
            letterSpacing="tight"
            color="onDark.base"
            css={{ hyphens: "auto", overflowWrap: "break-word" }}
          >
            {data.title}
          </Heading>
          {!!facts.length && (
            <Flex
              gap={{ base: "1.5rem", md: "3rem" }}
              flexWrap="wrap"
              marginTop="2rem"
            >
              {facts.map((fact) => (
                <Box key={fact.label}>
                  <Kicker color="aurora.teal" marginBottom=".5rem">
                    {fact.label}
                  </Kicker>
                  <Box fontWeight="bold" fontSize="lg" color="onDark.base">
                    {fact.value}
                  </Box>
                </Box>
              ))}
            </Flex>
          )}
        </Stack>
      </PageHero>

      <DefaultContainer paddingTop="3.5rem">
        <Stack gap="3.5rem">
          <Grid
            gridTemplateColumns={{ base: "1fr", lg: "1.65fr 1fr" }}
            gap={{ base: "2rem", lg: "3.5rem" }}
            alignItems="start"
          >
            <Stack gap="2rem" minWidth="0">
              <ImageGallery images={data.images} aspectRatio={2 / 1} />
              {data.body && (
                <Box>
                  <SectionHeading marginBottom="1.25rem">
                    {isEvent ? "Om arrangementet" : "Om aktiviteten"}
                  </SectionHeading>
                  <RichText
                    blockContent={data.body}
                    fontSize="md"
                    lineHeight={1.75}
                  />
                </Box>
              )}
            </Stack>

            <Stack gap="1rem">
              {!!data.organizers?.length && (
                <Section title="Arrangør" dark>
                  <Stack gap="1rem">
                    {data.organizers.map((organizer) => (
                      <Avatar key={organizer._id} entity={organizer} />
                    ))}
                  </Stack>
                </Section>
              )}
              {data.location && (
                <Section title="Sted">
                  <LocationCard {...data.location} />
                </Section>
              )}
              {data.paymentInfo && (
                <Section title="Betaling">
                  <Stack gap=".75rem" alignItems="flex-start">
                    {data.paymentInfo.body && (
                      <RichText
                        blockContent={data.paymentInfo.body}
                        fontSize="sm"
                        maxWidth="none"
                      />
                    )}
                    {data.paymentInfo.vippsNumber && (
                      <Text fontWeight="bold" fontSize="md">
                        <Icon asChild height="1.5rem">
                          <VippsIkon />
                        </Icon>
                        {data.paymentInfo.vippsNumber}
                      </Text>
                    )}
                    {data.paymentInfo.url && (
                      <CallToAction href={data.paymentInfo.url}>
                        Betal på nett
                      </CallToAction>
                    )}
                  </Stack>
                </Section>
              )}
            </Stack>
          </Grid>

          {data._type === "sessionSeries" && (
            <Calendar
              heading="Treningstider"
              seriesId={data._id}
              hideTitles
              whenEmpty="note"
            />
          )}
        </Stack>
      </DefaultContainer>

      <DefaultContainer paddingTop="4rem" paddingBottom="5rem">
        <Calendar
          heading="Andre kommende aktiviteter"
          limit={6}
          excludeIds={[data._id]}
          whenEmpty="hide"
          childrenAfter={
            <CallToAction href="/kalender" marginTop="2rem">
              Se hele kalenderen →
            </CallToAction>
          }
        />
      </DefaultContainer>
    </>
  );
};

const Section = (props: {
  title: string;
  dark?: boolean;
  children: React.ReactNode;
}) => (
  <Box
    background={props.dark ? "arctic.base" : "card.base"}
    color={props.dark ? "onDark.base" : "ink"}
    padding="1.5rem"
  >
    <Kicker
      as="h2"
      marginBottom=".75rem"
      color={props.dark ? "aurora.green" : "deep.base"}
    >
      {props.title}
    </Kicker>
    {props.children}
  </Box>
);

export default Page;

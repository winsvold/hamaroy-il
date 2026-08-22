import { Avatar } from "@/components/Avatar";
import { DefaultContainer } from "@/components/DefaultContainer";
import { VippsIkon } from "@/components/ikoner/vipps";
import { ImageGallery } from "@/components/ImageGallery";
import { Kicker } from "@/components/Kicker";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { resolveSport } from "@/sanity/sports";
import {
  formatNorwegianDate,
  formatNorwegianDateCapitalized,
} from "@/utils/date";
import { getSessionEndsAt } from "@/utils/session";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { isAfter } from "date-fns";
import { defineQuery } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AktivitetQueryResult } from "../../../../../sanity.types";
import { Calendar } from "../../components/calendar";

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

/**
 * Designet dekket bare enkeltarrangementer, men to av tre aktiviteter er faste serier
 * uten én bestemt dato. Serier viser derfor «Neste gang» — eller «Ikke planlagt» når
 * sesongen ikke er lagt ut ennå.
 */
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
        value: `${formatNorwegianDate(data.startsAt, "p")}–${formatNorwegianDate(data.endsAt, "p")}`,
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
      value: `${formatNorwegianDate(next.startsAt, "p")}–${formatNorwegianDate(getSessionEndsAt(next), "p")}`,
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
    <Stack gap={{ base: "2.5rem", md: "3.5rem" }}>
      <DefaultContainer paddingTop={{ base: "1.25rem", md: "1.75rem" }}>
        <Stack gap="1.5rem">
          <Flex
            as="nav"
            aria-label="Brødsmuler"
            gap=".4rem"
            flexWrap="wrap"
            fontSize="0.78rem"
            fontWeight={600}
            color="muted"
          >
            <Crumb href="/">Forside</Crumb>
            <span aria-hidden="true">/</span>
            {isEvent ? (
              <Crumb href="/kalender">Kalender</Crumb>
            ) : (
              <Crumb href="/faste-aktiviteter">Faste aktiviteter</Crumb>
            )}
            <span aria-hidden="true">/</span>
            <Box as="span" aria-current="page">
              {data.title}
            </Box>
          </Flex>

          {/* Hero-kortet */}
          <Box
            position="relative"
            overflow="hidden"
            background="forest.600"
            borderRadius="3xl"
          >
            <Box
              position="absolute"
              inset="0"
              background="amber.500"
              opacity={0.14}
            />
            <Stack
              position="relative"
              gap="1.1rem"
              padding={{ base: "1.75rem 1.5rem", md: "3rem" }}
            >
              {sport && (
                <Flex align="center" gap=".65rem">
                  <Box fontSize="1.625rem" aria-hidden="true">
                    {sport.emoji}
                  </Box>
                  <Box
                    background="rgba(242, 237, 226, 0.16)"
                    color="onDark"
                    fontSize="0.75rem"
                    fontWeight={700}
                    letterSpacing=".04em"
                    textTransform="uppercase"
                    borderRadius="full"
                    padding=".35rem .75rem"
                  >
                    {sport.title}
                  </Box>
                </Flex>
              )}
              <Heading
                as="h1"
                fontFamily="heading"
                fontWeight={800}
                fontSize={{ base: "1.875rem", md: "2.625rem" }}
                lineHeight={1.08}
                color="onDark"
                maxWidth="40rem"
              >
                {data.title}
              </Heading>
              {!!facts.length && (
                <Flex
                  gap={{ base: "1.25rem", md: "2rem" }}
                  flexWrap="wrap"
                  marginTop=".25rem"
                >
                  {facts.map((fact) => (
                    <Box key={fact.label}>
                      <Box
                        textStyle="kicker"
                        fontSize="0.66rem"
                        letterSpacing=".06em"
                        color="forest.400"
                      >
                        {fact.label}
                      </Box>
                      <Box fontWeight={700} fontSize="0.9rem" color="onDark">
                        {fact.value}
                      </Box>
                    </Box>
                  ))}
                </Flex>
              )}
            </Stack>
          </Box>

          <Grid
            gridTemplateColumns={{ base: "1fr", lg: "1.7fr 1fr" }}
            gap={{ base: "2rem", lg: "3rem" }}
            alignItems="start"
          >
            <Stack gap="1.5rem" minWidth="0">
              <ImageGallery images={data.images} aspectRatio={2 / 1} />
              {data.body && (
                <Stack gap="1rem">
                  <Kicker as="h2">
                    {isEvent ? "Om arrangementet" : "Om aktiviteten"}
                  </Kicker>
                  <RichText blockContent={data.body} fontSize="1rem" />
                </Stack>
              )}
            </Stack>

            <Stack gap="1rem">
              {!!data.organizers?.length && (
                <SideCard title="Arrangør">
                  <Stack gap="1rem">
                    {data.organizers.map((organizer) => (
                      <Avatar key={organizer._id} entity={organizer} />
                    ))}
                  </Stack>
                </SideCard>
              )}
              {data.location && (
                <SideCard title="Sted" dark>
                  <Stack gap=".15rem" alignItems="flex-start">
                    <Box
                      asChild
                      fontWeight={700}
                      fontSize="0.9rem"
                      color="onDark"
                      _hover={{ textDecoration: "underline" }}
                    >
                      <Link href={`/lokaler/${data.location.slug?.current}`}>
                        {data.location.name}
                      </Link>
                    </Box>
                    {data.location.address && (
                      <Text fontSize="0.8rem" color="forest.200">
                        {[data.location.address, data.location.city]
                          .filter(Boolean)
                          .join(", ")}
                      </Text>
                    )}
                  </Stack>
                </SideCard>
              )}
              {data.paymentInfo && (
                <SideCard title="Betaling">
                  <Stack gap=".65rem" alignItems="flex-start">
                    {data.paymentInfo.body && (
                      <RichText
                        blockContent={data.paymentInfo.body}
                        fontSize="0.85rem"
                        maxWidth="none"
                      />
                    )}
                    {data.paymentInfo.vippsNumber && (
                      <Text fontWeight={700} fontSize="0.9rem">
                        <Icon asChild height="1.5rem">
                          <VippsIkon />
                        </Icon>
                        {data.paymentInfo.vippsNumber}
                      </Text>
                    )}
                    {data.paymentInfo.url && (
                      <Button
                        asChild
                        size="sm"
                        background="forest.700"
                        color="onDark"
                        borderRadius="md"
                        _hover={{ background: "forest.800" }}
                      >
                        <a href={data.paymentInfo.url}>Betal på nett</a>
                      </Button>
                    )}
                  </Stack>
                </SideCard>
              )}
            </Stack>
          </Grid>

          {data._type === "sessionSeries" && (
            <Calendar
              heading="Treningstider"
              seriesId={data._id}
              showTitles={false}
            />
          )}
        </Stack>
      </DefaultContainer>

      <Box background="surface" paddingY={{ base: "2.5rem", md: "3.5rem" }}>
        <DefaultContainer>
          <Calendar
            heading="Andre kommende aktiviteter"
            variant="grid"
            limit={4}
            excludeIds={[data._id]}
          />
        </DefaultContainer>
      </Box>
    </Stack>
  );
};

const Crumb = ({ href, children }: { href: string; children: string }) => (
  <Box asChild _hover={{ color: "amber.700", textDecoration: "underline" }}>
    <Link href={href}>{children}</Link>
  </Box>
);

const SideCard = ({
  title,
  dark,
  children,
}: {
  title: string;
  dark?: boolean;
  children: React.ReactNode;
}) => (
  <Box
    background={dark ? "forest.700" : "surface"}
    border={dark ? undefined : "1px solid"}
    borderColor="hairline"
    borderRadius="2xl"
    padding="1.375rem"
    color={dark ? "onDark" : "forest.700"}
  >
    <Kicker
      as="h2"
      fontSize="0.68rem"
      marginBottom=".7rem"
      color={dark ? "forest.200" : "forest.700"}
    >
      {title}
    </Kicker>
    {children}
  </Box>
);

export default Page;

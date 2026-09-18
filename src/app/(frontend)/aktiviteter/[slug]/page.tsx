import { Avatar } from "@/components/Avatar";
import { CallToAction } from "@/components/CallToAction";
import { VippsIkon } from "@/components/ikoner/vipps";
import { ImageGallery } from "@/components/ImageGallery";
import { Kicker } from "@/components/Kicker";
import { LocationCard } from "@/components/Location";
import { RichText } from "@/components/RichText";
import { SectionHeading } from "@/components/SectionHeading";
import { SideCard } from "@/components/SideCard";
import { WithSidebar } from "@/components/WithSidebar";
import { sanityFetch } from "@/sanity/lib/client";
import { sessionTimes, upcomingFirst } from "@/sanity/lib/sessions";
import { getSport } from "@/sanity/sports";
import {
  formatNorwegianDateCapitalized,
  formatNorwegianTimeRange,
} from "@/utils/date";
import { Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { sift } from "radash";
import { AktivitetQueryResult } from "../../../../../sanity.types";
import { Calendar } from "../../components/calendar";
import { PageContent } from "../../layout/PageContent";
import { PageHeader } from "../../layout/PageHeader";

const aktivitetQuery =
  defineQuery(`*[_type in ["sessionSeries", "event"] && (slug.current == $slug || _id == $slug)][0]{
  _id,
  _type,
  title,
  sport,
  startsAt,
  endsAt,
  body,
  images,
  paymentInfo,
  location->,
  organizers[]->,
  "nextSession": sessions[cancelled != true] { ${sessionTimes} } ${upcomingFirst} [0],
}`);

type Aktivitet = NonNullable<AktivitetQueryResult>;

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: Props) => {
  const { slug } = await props.params;
  const data = await sanityFetch(aktivitetQuery, { slug });

  if (!data) return notFound();

  const isEvent = data._type === "event";
  // Referanser til upubliserte personer kommer ut som null
  const organizers = sift(data.organizers ?? []);
  const hasSidebar = !!(organizers.length || data.location || data.paymentInfo);

  return (
    <>
      <PageHeader
        variant="detail"
        kicker={getSport(data.sport)?.title}
        title={data.title ?? ""}
      >
        <Facts facts={getFacts(data)} />
      </PageHeader>

      <PageContent>
        <WithSidebar
          sidebar={
            hasSidebar && (
              <>
                {!!organizers.length && (
                  <SideCard title="Arrangør" dark>
                    <Stack gap="1rem">
                      {organizers.map((organizer) => (
                        <Avatar key={organizer._id} entity={organizer} />
                      ))}
                    </Stack>
                  </SideCard>
                )}
                {data.location && (
                  <SideCard title="Sted">
                    <LocationCard {...data.location} />
                  </SideCard>
                )}
                {data.paymentInfo && (
                  <SideCard title="Betaling">
                    <Payment paymentInfo={data.paymentInfo} />
                  </SideCard>
                )}
              </>
            )
          }
        >
          <ImageGallery images={data.images} aspectRatio={2 / 1} />
          {data.body && (
            <Box as="section">
              <SectionHeading>
                {isEvent ? "Om arrangementet" : "Om aktiviteten"}
              </SectionHeading>
              <RichText blockContent={data.body} />
            </Box>
          )}
        </WithSidebar>

        {!isEvent && (
          <Calendar
            heading="Treningstider"
            seriesId={data._id}
            hideTitles
            whenEmpty="note"
          />
        )}
        <Calendar
          heading="Andre kommende aktiviteter"
          limit={6}
          excludeId={data._id}
          whenEmpty="hide"
          showCalendarLink
        />
      </PageContent>
    </>
  );
};

/** Dato og tid for arrangementer, neste gang for faste aktiviteter */
const getFacts = (data: Aktivitet) => {
  const place = data.location?.name && {
    label: "Sted",
    value: data.location.name,
  };

  if (data._type === "event")
    return sift([
      {
        label: "Dato",
        value: formatNorwegianDateCapitalized(data.startsAt, "EEEE d. MMMM y"),
      },
      {
        label: "Tid",
        value: formatNorwegianTimeRange(data.startsAt, data.endsAt),
      },
      place,
    ]);

  const next = data.nextSession;
  return sift([
    {
      label: "Neste gang",
      value: next
        ? formatNorwegianDateCapitalized(next.startsAt, "EEEE d. MMMM")
        : "Ikke planlagt",
    },
    next && {
      label: "Tid",
      value: formatNorwegianTimeRange(next.startsAt, next.endsAt),
    },
    place,
  ]);
};

const Facts = ({ facts }: { facts: { label: string; value: string }[] }) => (
  <Flex gap={{ base: "1.5rem", md: "3rem" }} flexWrap="wrap" marginTop="2rem">
    {facts.map((fact) => (
      <Box key={fact.label}>
        <Kicker color="aurora.teal" marginBottom=".5rem">
          {fact.label}
        </Kicker>
        <Box fontWeight="bold" fontSize="lg">
          {fact.value}
        </Box>
      </Box>
    ))}
  </Flex>
);

const Payment = ({
  paymentInfo,
}: {
  paymentInfo: NonNullable<Aktivitet["paymentInfo"]>;
}) => (
  <Stack gap=".75rem" alignItems="flex-start">
    <RichText blockContent={paymentInfo.body} fontSize="sm" maxWidth="none" />
    {paymentInfo.vippsNumber && (
      <Text fontWeight="bold">
        <Icon asChild height="1.5rem">
          <VippsIkon />
        </Icon>
        {paymentInfo.vippsNumber}
      </Text>
    )}
    {paymentInfo.url && (
      <CallToAction href={paymentInfo.url}>Betal på nett</CallToAction>
    )}
  </Stack>
);

export default Page;

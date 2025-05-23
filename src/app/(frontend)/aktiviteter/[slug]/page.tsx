import { Avatar } from "@/components/Avatar";
import { DefaultContainer } from "@/components/DefaultContainer";
import { VippsIkon } from "@/components/ikoner/vipps";
import { LocationCard } from "@/components/Location";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  Box,
  Button,
  Grid,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Activities } from "../../components/activities";
import { formatNorwegianDate } from "@/utils/date";

const aktivitetQuery =
  defineQuery(`*[_type in ["sessionSeries", "event"] && (slug.current == $slug || _id == $slug)][0]{
  ...,
  location->,
  organizers[]->,
}`);

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const data = await sanityFetch(aktivitetQuery, { slug: params.slug });

  if (!data) return notFound();

  return (
    <DefaultContainer>
      <Stack gap="1rem">
        <Heading as="h1" size="4xl">
          {data?.title}
        </Heading>
        {data?.images?.[0] && (
          <Box asChild borderRadius="lg" width="100%">
            <Image
              alt=""
              src={urlFor(data.images[0]).width(800).height(400).url()}
              width={800}
              height={400}
            />
          </Box>
        )}
        <Stack gap="1rem">
          <Grid gap="1rem" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}>
            <Stack>
              {data._type === "event" && (
                <Box fontWeight={600} padding="0 .75rem">
                  {formatNorwegianDate(data.startsAt, "p")} -{" "}
                  {formatNorwegianDate(data.endsAt, "p")}
                </Box>
              )}
              {data.organizers?.length && (
                <Section title="Kontakt">
                  <Stack gap="1rem">
                    {data.organizers?.map((organizer) => (
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
                  {data.paymentInfo?.body && (
                    <RichText blockContent={data.paymentInfo.body} />
                  )}
                  {data.paymentInfo?.vippsNumber && (
                    <Text fontWeight={600}>
                      <Icon asChild height="1.5rem">
                        <VippsIkon />
                      </Icon>
                      {data.paymentInfo.vippsNumber}
                    </Text>
                  )}
                  {data.paymentInfo?.url && (
                    <Button asChild>
                      <a href={data.paymentInfo.url}>Betal på nett</a>
                    </Button>
                  )}
                </Section>
              )}
            </Stack>
            <RichText blockContent={data.body} />
          </Grid>
          {data._type === "sessionSeries" && (
            <Activities seriesId={data?._id} />
          )}
        </Stack>
      </Stack>
    </DefaultContainer>
  );
};

const Section = (props: { title: string; children: React.ReactNode }) => (
  <Box background="gray.100" borderRadius="md">
    <Heading
      padding=".5rem"
      background="gray.200"
      borderTopRadius="md"
      as="h3"
      size="sm"
    >
      {props.title}
    </Heading>
    <Box padding=".5rem">{props.children}</Box>
  </Box>
);

export default Page;

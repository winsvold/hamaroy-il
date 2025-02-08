import { Avatar } from "@/components/Avatar";
import { DefaultContainer } from "@/components/DefaultContainer";
import { sanityClient } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Sessions } from "../../components/sessions";
import { LocationCard } from "@/components/Location";
import { RichText } from "@/components/RichText";

const aktivitetQuery =
  defineQuery(`*[_type == "sessionSeries" && slug.current == $slug][0]{
  ...,
  location->,
  organizers[]->,
}`);

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const data = await sanityClient.fetch(aktivitetQuery, { slug: params.slug });

  if (!data) return notFound();

  return (
    <DefaultContainer>
      <Stack gap="1rem">
        <Heading as="h1" size="4xl">
          {data?.title}
        </Heading>
        {data?.images?.[0] && (
          <Box asChild borderRadius="lg">
            <Image
              alt=""
              src={urlFor(data.images[0]).width(800).url()}
              width={800}
              height={400}
            />
          </Box>
        )}
        <Stack gap="2rem">
          <Flex gap="4rem">
            <Stack>
              {data.organizers?.length && (
                <Stack>
                  <Heading as="h3" size="sm" color="gray.500">
                    Kontakt
                  </Heading>
                  {data.organizers?.map((organizer) => (
                    <Avatar key={organizer._id} {...organizer} />
                  ))}
                </Stack>
              )}
              {data.location && (
                <Stack>
                  <Heading as="h3" size="sm" color="gray.500">
                    Sted
                  </Heading>
                  <LocationCard {...data.location} />
                </Stack>
              )}
              <Stack>
                <Heading as="h3" size="sm" color="gray.500">
                  Betaling
                </Heading>
                Info her
              </Stack>
            </Stack>
            <RichText blockContent={data.description} />
          </Flex>
          <Sessions seriesId={data?._id} />
        </Stack>
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

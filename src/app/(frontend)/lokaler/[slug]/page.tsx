import { DefaultContainer } from "@/components/DefaultContainer";
import { RichText } from "@/components/RichText";
import { sanityClient } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Sessions } from "../../components/activities";

const lokasjonQuery =
  defineQuery(`*[_type == "location" && slug.current == $slug][0]{
  ...,
}`);

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const data = await sanityClient.fetch(lokasjonQuery, { slug: params.slug });

  if (!data) return notFound();

  return (
    <DefaultContainer>
      <Stack gap="1rem">
        <Heading as="h1" size="4xl">
          {data?.name}
        </Heading>
        {data?.images?.[0] && (
          <Box asChild borderRadius="lg">
            <Image
              alt=""
              src={urlFor(data.images[0]).size(800, 400).url()}
              width={800}
              height={400}
            />
          </Box>
        )}
        <Stack gap="2rem">
          <Flex gap="4rem">
            <RichText blockContent={data.description} />
          </Flex>
          <Sessions locationId={data?._id} />
        </Stack>
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

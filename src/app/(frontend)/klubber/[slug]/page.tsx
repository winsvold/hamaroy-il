import { Avatar } from "@/components/Avatar";
import { DefaultContainer } from "@/components/DefaultContainer";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Activities } from "../../components/activities";
import { urlFor } from "@/sanity/lib/image";

const clubPageQuery = defineQuery(`
  *[_type == "club" && slug.current == $slug][0] {
    ...,
    managers[] {
      ...,
      person->
    }
  }
`);

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const data = await sanityFetch(clubPageQuery, { slug: params.slug });

  if (!data) return notFound();

  return (
    <DefaultContainer>
      <Stack gap="1rem">
        <Heading as="h1" size="4xl">
          {data?.name}
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
        <Flex gap="1rem" flexWrap="wrap">
          <Stack gap="1rem">
            <Stack gap="1rem">
              {data.managers?.map((manager) => (
                <Stack
                  background="blackAlpha.100"
                  padding=".5rem"
                  borderRadius="md"
                  key={manager.person?._id}
                >
                  {manager.person && <Avatar entity={manager.person} />}
                  {manager.role}
                </Stack>
              ))}
            </Stack>
          </Stack>
          <RichText blockContent={data.body} />
        </Flex>
        <Activities heading="Aktiviteter:" clubId={data._id} />
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

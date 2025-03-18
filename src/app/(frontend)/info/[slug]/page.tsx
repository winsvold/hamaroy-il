import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { Heading, Stack, Container } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";

const infoPageQuery = defineQuery(
  `*[_type == "infoPage" && slug.current == $slug][0]`,
);

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const data = await sanityFetch(infoPageQuery, { slug: params.slug });

  if (!data) return notFound();

  return (
    <Container maxWidth="35rem">
      <Stack gap="1rem">
        <Heading as="h1" size="4xl">
          {data?.title}
        </Heading>
        <RichText blockContent={data.body} />
      </Stack>
    </Container>
  );
};

export default Page;

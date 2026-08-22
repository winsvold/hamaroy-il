import { DefaultContainer } from "@/components/DefaultContainer";
import { PageIntro } from "@/components/PageIntro";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { Stack } from "@chakra-ui/react";
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
    // Rene tekstsider får lesebredde framfor den brede sidemalen
    <DefaultContainer maxW="42rem" paddingTop={{ base: "2rem", md: "3.5rem" }}>
      <Stack gap="1.75rem">
        <PageIntro title={data.title ?? ""} />
        <RichText blockContent={data.body} fontSize="1rem" maxWidth="none" />
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

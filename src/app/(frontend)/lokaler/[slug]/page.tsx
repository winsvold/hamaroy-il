import { DefaultContainer } from "@/components/DefaultContainer";
import { ImageGallery } from "@/components/ImageGallery";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { Heading, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { Calendar } from "../../components/calendar";

const lokasjonQuery =
  defineQuery(`*[_type == "location" && slug.current == $slug][0]{
  ...,
}`);

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const data = await sanityFetch(lokasjonQuery, { slug: params.slug });

  if (!data) return notFound();

  return (
    <DefaultContainer>
      <Stack gap="2rem">
        <Stack gap="1rem">
          <Heading as="h1" size="4xl">
            {data?.name}
          </Heading>
          <ImageGallery images={data.images} aspectRatio={2 / 1} />
        </Stack>
        <RichText blockContent={data.body} />
        <Calendar
          heading={`Aktiviteter i ${data?.name}:`}
          locationId={data?._id}
        />
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

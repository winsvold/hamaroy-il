import { DefaultContainer } from "@/components/DefaultContainer";
import { ImageGallery } from "@/components/ImageGallery";
import { PageIntro } from "@/components/PageIntro";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { Stack } from "@chakra-ui/react";
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
    <DefaultContainer paddingTop={{ base: "2rem", md: "3.5rem" }}>
      <Stack gap="2.5rem">
        <PageIntro
          kicker="Lokale"
          title={data.name ?? ""}
          text={[data.address, data.zip, data.city].filter(Boolean).join(", ")}
        />
        <ImageGallery images={data.images} aspectRatio={2 / 1} />
        <RichText blockContent={data.body} fontSize="1rem" />
        <Calendar
          heading={`Aktiviteter i ${data.name}`}
          locationId={data._id}
        />
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

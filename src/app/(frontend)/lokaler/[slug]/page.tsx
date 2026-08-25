import { DefaultContainer } from "@/components/DefaultContainer";
import { ImageGallery } from "@/components/ImageGallery";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { Calendar } from "../../components/calendar";
import { PageHeader } from "../../layout/PageHeader";

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
    <>
      <PageHeader
        variant="detail"
        kicker="Lokale"
        title={data.name ?? ""}
        text={[data.address, data.zip, data.city].filter(Boolean).join(", ")}
      />
      <DefaultContainer paddingTop="3.5rem" paddingBottom="4.75rem">
        <Stack gap="3.5rem">
          <ImageGallery images={data.images} aspectRatio={2 / 1} />
          <RichText
            blockContent={data.body}
            fontSize="1rem"
            lineHeight={1.72}
          />
          <Calendar
            heading={`Aktiviteter i ${data.name}`}
            locationId={data._id}
            whenEmpty="hide"
          />
        </Stack>
      </DefaultContainer>
    </>
  );
};

export default Page;

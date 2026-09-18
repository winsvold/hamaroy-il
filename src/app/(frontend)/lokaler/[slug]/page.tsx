import { ImageGallery } from "@/components/ImageGallery";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { formatAddress } from "@/utils/address";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { Calendar } from "../../components/calendar";
import { PageContent } from "../../layout/PageContent";
import { PageHeader } from "../../layout/PageHeader";

const lokasjonQuery =
  defineQuery(`*[_type == "location" && slug.current == $slug][0]{
  ...,
}`);

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: Props) => {
  const { slug } = await props.params;
  const data = await sanityFetch(lokasjonQuery, { slug });

  if (!data) return notFound();

  return (
    <>
      <PageHeader
        variant="detail"
        kicker="Lokale"
        title={data.name ?? ""}
        text={formatAddress(data)}
      />
      <PageContent>
        <ImageGallery images={data.images} aspectRatio={2 / 1} />
        <RichText blockContent={data.body} />
        <Calendar
          heading={`Aktiviteter i ${data.name}`}
          locationId={data._id}
          whenEmpty="hide"
        />
      </PageContent>
    </>
  );
};

export default Page;

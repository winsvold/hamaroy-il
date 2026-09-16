import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { PageContent } from "../../layout/PageContent";
import { PageHeader } from "../../layout/PageHeader";

const infoPageQuery = defineQuery(
  `*[_type == "infoPage" && slug.current == $slug][0]`,
);

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async (props: Props) => {
  const { slug } = await props.params;
  const data = await sanityFetch(infoPageQuery, { slug });

  if (!data) return notFound();

  return (
    <>
      <PageHeader variant="detail" title={data.title ?? ""} />
      <PageContent maxW="2xl">
        <RichText blockContent={data.body} maxWidth="none" />
      </PageContent>
    </>
  );
};

export default Page;

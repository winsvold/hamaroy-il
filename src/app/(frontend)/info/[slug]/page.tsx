import { DefaultContainer } from "@/components/DefaultContainer";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { PageHeader } from "../../layout/PageHeader";

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
    <>
      <PageHeader variant="detail" title={data.title ?? ""} />
      <DefaultContainer maxW="2xl" paddingTop="3.5rem" paddingBottom="5rem">
        <RichText
          blockContent={data.body}
          fontSize="md"
          lineHeight={1.75}
          maxWidth="none"
        />
      </DefaultContainer>
    </>
  );
};

export default Page;

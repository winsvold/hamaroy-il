import { Avatar } from "@/components/Avatar";
import { ImageGallery } from "@/components/ImageGallery";
import { RichText } from "@/components/RichText";
import { SideCard } from "@/components/SideCard";
import { WithSidebar } from "@/components/WithSidebar";
import { sanityFetch } from "@/sanity/lib/client";
import { Stack, Text } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { ClubPageQueryResult } from "../../../../../sanity.types";
import { Calendar } from "../../components/calendar";
import { PageContent } from "../../layout/PageContent";
import { PageHeader } from "../../layout/PageHeader";

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
  const { slug } = await props.params;
  const data = await sanityFetch(clubPageQuery, { slug });

  if (!data) return notFound();

  return (
    <>
      <PageHeader variant="detail" kicker="Klubb" title={data.name ?? ""} />
      <PageContent>
        <ImageGallery images={data.images} aspectRatio={2 / 1} />
        <WithSidebar
          sidebar={
            !!data.managers?.length && <Managers managers={data.managers} />
          }
        >
          <RichText blockContent={data.body} />
        </WithSidebar>
        <Calendar heading="Aktiviteter" clubId={data._id} whenEmpty="hide" />
      </PageContent>
    </>
  );
};

type Manager = NonNullable<
  NonNullable<ClubPageQueryResult>["managers"]
>[number];

const Managers = ({ managers }: { managers: Manager[] }) => (
  <SideCard title="Ledere">
    <Stack gap="1.25rem">
      {managers.map((manager) => (
        <Stack key={manager._key} gap=".25rem">
          {manager.person && <Avatar entity={manager.person} />}
          {manager.role && (
            <Text fontSize="sm" color="muted">
              {manager.role}
            </Text>
          )}
        </Stack>
      ))}
    </Stack>
  </SideCard>
);

export default Page;

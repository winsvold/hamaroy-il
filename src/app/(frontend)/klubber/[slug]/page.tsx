import { Avatar } from "@/components/Avatar";
import { DefaultContainer } from "@/components/DefaultContainer";
import { ImageGallery } from "@/components/ImageGallery";
import { Kicker } from "@/components/Kicker";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { Box, Grid, Stack, Text } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { Calendar } from "../../components/calendar";
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
  const params = await props.params;
  const data = await sanityFetch(clubPageQuery, { slug: params.slug });

  if (!data) return notFound();

  return (
    <>
      <PageHeader variant="detail" kicker="Klubb" title={data.name ?? ""} />
      <DefaultContainer paddingTop="3.5rem" paddingBottom="4.75rem">
        <Stack gap="3.5rem">
          <ImageGallery images={data.images} aspectRatio={2 / 1} />

          <Grid
            gridTemplateColumns={{ base: "1fr", lg: "1.65fr 1fr" }}
            gap={{ base: "2rem", lg: "3.5rem" }}
            alignItems="start"
          >
            <RichText
              blockContent={data.body}
              fontSize="1rem"
              lineHeight={1.72}
            />

            {!!data.managers?.length && (
              <Box background="card.base" padding="1.5rem">
                <Kicker as="h2" marginBottom=".875rem">
                  Ledere
                </Kicker>
                <Stack gap="1.25rem">
                  {data.managers.map((manager) => (
                    <Stack
                      gap=".35rem"
                      key={manager.person?._id ?? manager._key}
                    >
                      {manager.person && <Avatar entity={manager.person} />}
                      {manager.role && (
                        <Text fontSize="0.8125rem" color="muted">
                          {manager.role}
                        </Text>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}
          </Grid>

          <Calendar heading="Aktiviteter" clubId={data._id} whenEmpty="hide" />
        </Stack>
      </DefaultContainer>
    </>
  );
};

export default Page;

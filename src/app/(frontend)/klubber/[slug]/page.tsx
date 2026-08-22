import { Avatar } from "@/components/Avatar";
import { DefaultContainer } from "@/components/DefaultContainer";
import { ImageGallery } from "@/components/ImageGallery";
import { Kicker } from "@/components/Kicker";
import { PageIntro } from "@/components/PageIntro";
import { RichText } from "@/components/RichText";
import { sanityFetch } from "@/sanity/lib/client";
import { Box, Grid, Stack, Text } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { Calendar } from "../../components/calendar";

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
    <DefaultContainer paddingTop={{ base: "2rem", md: "3.5rem" }}>
      <Stack gap="2.5rem">
        <PageIntro kicker="Klubb" title={data.name ?? ""} />
        <ImageGallery images={data.images} aspectRatio={2 / 1} />

        <Grid
          gridTemplateColumns={{ base: "1fr", lg: "1.7fr 1fr" }}
          gap={{ base: "2rem", lg: "3rem" }}
          alignItems="start"
        >
          <RichText blockContent={data.body} fontSize="1rem" />

          {!!data.managers?.length && (
            <Box
              background="surface"
              border="1px solid"
              borderColor="hairline"
              borderRadius="2xl"
              padding="1.375rem"
            >
              <Kicker as="h2" fontSize="0.68rem" marginBottom=".9rem">
                Ledere
              </Kicker>
              <Stack gap="1.25rem">
                {data.managers.map((manager) => (
                  <Stack gap=".35rem" key={manager.person?._id ?? manager._key}>
                    {manager.person && <Avatar entity={manager.person} />}
                    {manager.role && (
                      <Text fontSize="0.8rem" color="muted">
                        {manager.role}
                      </Text>
                    )}
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}
        </Grid>

        <Calendar heading="Aktiviteter" clubId={data._id} />
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

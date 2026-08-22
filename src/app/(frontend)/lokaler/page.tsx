import { DefaultContainer } from "@/components/DefaultContainer";
import { PageIntro } from "@/components/PageIntro";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  Box,
  Grid,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
} from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

const locationsQuery = defineQuery(`*[_type == "location"] | order(name asc)`);

const Page = async () => {
  const data = await sanityFetch(locationsQuery);

  return (
    <DefaultContainer paddingTop={{ base: "2rem", md: "3.5rem" }}>
      <Stack gap="2.5rem">
        <PageIntro
          kicker="Lokaler"
          title="Lokaler og steder"
          text="Hallene, banene og husene idrettslaget bruker."
        />
        <Grid
          gridTemplateColumns="repeat(auto-fill, minmax(min(18rem, 100%), 1fr))"
          gap=".875rem"
        >
          {data.map((location) => (
            <LinkBox
              display="flex"
              alignItems="center"
              key={location._id}
              background="surface"
              border="1px solid"
              borderColor="hairline"
              borderRadius="2xl"
              padding="1rem"
              gap="1rem"
              transition="border-color .2s"
              _hover={{ borderColor: "hairlineStrong" }}
            >
              {location.images?.[0] && (
                <Box
                  asChild
                  flexShrink={0}
                  borderRadius="xl"
                  width="4.5rem"
                  height="4.5rem"
                  objectFit="cover"
                >
                  <Image
                    alt=""
                    src={urlFor(location.images[0]).size(300, 300).url()}
                    width={300}
                    height={300}
                  />
                </Box>
              )}
              <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
                <Link href={`/lokaler/${location.slug?.current}`}>
                  <Heading
                    as="h2"
                    fontFamily="body"
                    fontWeight={700}
                    fontSize="1rem"
                    color="forest.700"
                  >
                    {location.name}
                  </Heading>
                </Link>
              </LinkOverlay>
            </LinkBox>
          ))}
        </Grid>
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

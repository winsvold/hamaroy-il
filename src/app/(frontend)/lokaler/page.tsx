import { DefaultContainer } from "@/components/DefaultContainer";
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

const locationsQuery = defineQuery(`*[_type == "location"]`);

const Page = async () => {
  const data = await sanityFetch(locationsQuery);

  return (
    <DefaultContainer>
      <Stack>
        <Heading as="h1">Lokaler og steder</Heading>
        <Grid
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap="1rem"
        >
          {data.map((location) => (
            <LinkBox
              display="flex"
              key={location._id}
              backgroundColor="gray.100"
              padding=".75rem"
              borderRadius="md"
              gap="1rem"
            >
              {location.images?.[0] && (
                <Box asChild borderRadius="lg" width="7rem" height="7rem">
                  <Image
                    alt=""
                    src={urlFor(location.images[0]).size(300, 300).url()}
                    width={800}
                    height={400}
                  />
                </Box>
              )}
              <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
                <Link href={`/lokaler/${location.slug?.current}`}>
                  <Heading as="h2">{location.name}</Heading>
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

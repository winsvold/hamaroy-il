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

const clubsQuery = defineQuery(`*[_type == "club"]`);

const Page = async () => {
  const data = await sanityFetch(clubsQuery);

  return (
    <DefaultContainer>
      <Stack>
        <Heading as="h1">Klubber</Heading>
        <Grid
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap="1rem"
        >
          {data.map((club) => (
            <LinkBox
              display="flex"
              key={club._id}
              backgroundColor="gray.100"
              padding=".75rem"
              borderRadius="md"
              gap="1rem"
            >
              {club.images?.[0] && (
                <Box asChild borderRadius="lg" width="7rem" height="7rem">
                  <Image
                    alt=""
                    src={urlFor(club.images[0]).size(300, 300).url()}
                    width={800}
                    height={400}
                  />
                </Box>
              )}
              <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
                <Link href={`/klubber/${club.slug?.current}`}>
                  <Heading as="h2">{club.name}</Heading>
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

import { CardGrid } from "@/components/CardGrid";
import { DefaultContainer } from "@/components/DefaultContainer";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Box, Heading, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "../layout/PageHeader";

const locationsQuery = defineQuery(`*[_type == "location"] | order(name asc)`);

const Page = async () => {
  const data = await sanityFetch(locationsQuery);

  return (
    <>
      <PageHeader kicker="Lokaler" title="Lokaler og steder" />
      <DefaultContainer paddingTop="3.75rem" paddingBottom="4.75rem">
        <CardGrid>
          {data.map((location) => (
            <LinkBox
              display="flex"
              alignItems="center"
              key={location._id}
              background="card.base"
              padding="1rem"
              gap="1rem"
              transition="background .2s"
              _hover={{
                background: "card.hover",
                "& h2": { color: "deep.base" },
              }}
            >
              {location.images?.[0] && (
                <Box
                  asChild
                  flexShrink={0}
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
              <LinkOverlay asChild>
                <Link href={`/lokaler/${location.slug?.current}`}>
                  <Heading
                    as="h2"
                    fontFamily="body"
                    fontWeight={700}
                    fontSize="1rem"
                    color="ink"
                    transition="color .2s"
                  >
                    {location.name}
                  </Heading>
                </Link>
              </LinkOverlay>
            </LinkBox>
          ))}
        </CardGrid>
      </DefaultContainer>
    </>
  );
};

export default Page;

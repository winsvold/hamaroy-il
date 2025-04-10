import { DefaultContainer } from "@/components/DefaultContainer";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Box, Flex, Heading, HStack, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { HeaderLink } from "./HeaderLink";

const headerQuery = defineQuery(`{
  "siteSettings": *[_type == "siteSettings"][0],
  "infoPages": *[_type == "infoPage"],
  "clubs": *[_type == "club"]
}`);

export const Header = async () => {
  const data = await sanityFetch(headerQuery);
  const logoUrl =
    data?.siteSettings?.logo &&
    urlFor(data?.siteSettings?.logo).size(100, 100).url();

  return (
    <Box as="header" paddingY="1.5rem">
      <DefaultContainer>
        <Stack gap="1rem">
          <HStack asChild gap="1rem">
            <Link href="/">
              {logoUrl && (
                <Box
                  borderRadius="50%"
                  overflow="hidden"
                  width="2.5rem"
                  asChild
                >
                  <Image alt="" src={logoUrl} width={100} height={100} />
                </Box>
              )}
              <Heading as="h1" size="2xl">
                Hamarøy IL
              </Heading>
            </Link>
          </HStack>
          <Flex
            as="ul"
            gap="1rem 2rem"
            fontSize={{ base: "1rem", sm: "1.35rem" }}
            flexWrap="wrap"
          >
            <HeaderLink href="/aktiviteter">Hva skjer</HeaderLink>
            <HeaderLink href="/lokaler">Lokaler</HeaderLink>
            {data.infoPages.map((page) => (
              <HeaderLink key={page._id} href={`/info/${page.slug?.current}`}>
                {page.title}
              </HeaderLink>
            ))}
            {data.clubs.map((club) => (
              <HeaderLink
                key={club._id}
                href={`/klubber/${club.slug?.current}`}
              >
                {club.name}
              </HeaderLink>
            ))}
          </Flex>
        </Stack>
      </DefaultContainer>
    </Box>
  );
};

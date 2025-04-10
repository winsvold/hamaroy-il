import { DefaultContainer } from "@/components/DefaultContainer";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Box, Flex, Heading, HStack, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { HeaderLink } from "./HeaderLink";
import { MobileMenu } from "./MobileMenu";

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

  const links = [
    { href: "/aktiviteter", label: "Hva skjer" },
    { href: "/lokaler", label: "Lokaler" },
    ...data.infoPages.map((page) => ({
      href: `/info/${page.slug?.current}`,
      label: page.title,
    })),
    ...data.clubs.map((club) => ({
      href: `/klubber/${club.slug?.current}`,
      label: club.name,
    })),
  ];

  const logo = (
    <HStack gap="1rem" asChild>
      <Link href="/">
        {logoUrl && (
          <Box borderRadius="50%" overflow="hidden" width="2.5rem" asChild>
            <Image alt="" src={logoUrl} width={100} height={100} />
          </Box>
        )}
        <Heading as="h1" size="2xl">
          Hamarøy IL
        </Heading>
      </Link>
    </HStack>
  );

  return (
    <Box as="header" paddingY="1.5rem">
      <DefaultContainer>
        <Stack gap="1rem">
          <Flex justify="space-between" align="center">
            {logo}
            <Box display={{ base: "block", md: "none" }}>
              <MobileMenu logo={logo}>
                <Stack gap=".75rem" fontSize="1.25rem">
                  {links.map((link) => (
                    <HeaderLink key={link.href} href={link.href}>
                      {link.label}
                    </HeaderLink>
                  ))}
                </Stack>
              </MobileMenu>
            </Box>
          </Flex>
          <Flex
            as="ul"
            gap="1rem 2rem"
            fontSize="1.35rem"
            flexWrap="wrap"
            display={{ base: "none", md: "flex" }}
          >
            {links.map((link) => (
              <HeaderLink key={link.href} href={link.href}>
                {link.label}
              </HeaderLink>
            ))}
          </Flex>
        </Stack>
      </DefaultContainer>
    </Box>
  );
};

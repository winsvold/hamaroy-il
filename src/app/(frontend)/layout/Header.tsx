import { DefaultContainer } from "@/components/DefaultContainer";
import { sanityClient } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Stack, Heading, Flex, Box, HStack } from "@chakra-ui/react";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { HeaderLink } from "./HeaderLink";

export const Header = async () => {
  const data = await sanityClient.fetch(groq`*[_type == "siteSettings"][0]`);
  const logoUrl = urlFor(data?.logo).url();

  return (
    <Box as="header" paddingY="1.5rem">
      <DefaultContainer>
        <Stack gap="1rem">
          <HStack asChild gap="1rem">
            <Link href="/">
              <Heading as="h1" size="3xl">
                Hamarøy IL
              </Heading>
              <Box borderRadius="50%" overflow="hidden" width="4rem" asChild>
                <Image alt="" src={logoUrl} width={100} height={100} />
              </Box>
            </Link>
          </HStack>
          <Flex as="ul" gap="2rem" fontSize="1.5rem">
            <HeaderLink href="/aktiviteter">Hva skjer</HeaderLink>
            <Box>Klubber</Box>
            <HeaderLink href="/lokaler">Lokaler</HeaderLink>
            <Box>Info</Box>
          </Flex>
        </Stack>
      </DefaultContainer>
    </Box>
  );
};

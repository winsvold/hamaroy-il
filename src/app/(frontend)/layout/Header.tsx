import { DefaultContainer } from "@/components/DefaultContainer";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Stack, Heading, Flex, Box, HStack } from "@chakra-ui/react";
import { groq } from "next-sanity";
import Image from "next/image";

export const Header = async () => {
  const data = await client.fetch(groq`*[_type == "siteSettings"][0]`);
  const logoUrl = urlFor(data?.logo).url();

  return (
    <Box as="header" padding="1.5rem" boxShadow="md">
      <DefaultContainer >
        <Stack gap="1rem">
          <HStack gap="1rem">
            <Box borderRadius="50%" overflow="hidden" width="4rem" asChild>
              <Image alt="" src={logoUrl} width={100} height={100} />
            </Box>
            <Heading as="h1" size="4xl">
              Hamarøy IL
            </Heading>
          </HStack>
          <Flex as="ul" gap="2rem" fontSize="1.5rem">
            <Box>Hva skjer</Box>
            <Box>Klubber</Box>
            <Box>Lokaler</Box>
            <Box>Info</Box>
          </Flex>
        </Stack>
      </DefaultContainer>
    </Box>
  );
};

import { urlFor } from "@/sanity/lib/image";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import Image from "next/image";
import { Location } from "../../sanity.types";

export const LocationCard = (location: Location) => {
  return (
    <Flex gap="1rem">
      {location.images?.[0] && (
        <Box asChild borderRadius="md" height="4rem" width="4rem">
          <Image
            height={200}
            width={200}
            src={urlFor(location.images[0]).size(200, 200).url()}
            alt={location.name ?? ""}
          />
        </Box>
      )}

      <Stack gap="0">
        <Heading as="h2">{location.name}</Heading>
      </Stack>
    </Flex>
  );
};

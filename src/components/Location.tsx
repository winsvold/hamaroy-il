import { urlFor } from "@/sanity/lib/image";
import { Box, Heading, LinkBox, LinkOverlay, Stack } from "@chakra-ui/react";
import Image from "next/image";
import { Location } from "../../sanity.types";
import Link from "next/link";

export const LocationCard = (location: Location) => {
  return (
    <LinkBox display="flex" gap="1rem">
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
        <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
          <Link href={`/lokaler/${location.slug?.current}`}>
            <Heading as="h2">{location.name}</Heading>
          </Link>
        </LinkOverlay>
      </Stack>
    </LinkBox>
  );
};

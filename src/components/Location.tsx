import { urlFor } from "@/sanity/lib/image";
import {
  Box,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { Location } from "../../sanity.types";
import Link from "next/link";

export const LocationCard = (location: Location) => {
  return (
    <LinkBox display="flex" gap="1rem">
      {location.images?.[0] && (
        <Box asChild height="4rem" width="4rem" flexShrink={0}>
          <Image
            height={200}
            width={200}
            src={urlFor(location.images[0]).size(200, 200).url()}
            alt={location.name ?? ""}
          />
        </Box>
      )}

      <Stack gap=".25rem">
        <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
          <Link href={`/lokaler/${location.slug?.current}`}>
            <Heading as="h3" size="md" fontFamily="body">
              {location.name}
            </Heading>
          </Link>
        </LinkOverlay>
        {location.address && (
          <Text fontSize="0.8125rem" fontWeight={500} color="muted">
            {[location.address, location.city].filter(Boolean).join(", ")}
          </Text>
        )}
      </Stack>
    </LinkBox>
  );
};

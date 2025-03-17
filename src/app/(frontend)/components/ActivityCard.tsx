import { formatNorwegianDate, formatNorwegianDuration } from "@/utils/date";
import {
  Box,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { MapPin } from "react-feather";
import { Event, Location } from "../../../../sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type Props = {
  startsAt?: string;
  endsAt?: string;
  title?: string;
  location: Location | null;
  slug?: string;
  image?: NonNullable<Event["images"]>[0];
};

export const ActivityCard = (props: Props) => {
  const { startsAt, endsAt, title, location, slug, image } = props;
  if (!startsAt) return null;

  return (
    <LinkBox
      display="flex"
      borderRadius="md"
      backgroundColor="green.100"
      gap=".5rem"
      _hover={{ backgroundColor: "green.200" }}
      transition=".3s"
      overflow="hidden"
    >
      <Stack
        justifyContent="center"
        background="green.200"
        gap="0"
        padding=".75rem 1rem"
        fontWeight={600}
        alignItems="center"
        lineHeight={1.2}
      >
        <Box>{formatNorwegianDate(startsAt, "p")}</Box>
        <Box fontSize="xs" opacity={0.6}>
          {formatNorwegianDuration(startsAt, endsAt)}
        </Box>
      </Stack>
      <Stack>
        {image && (
          <Box asChild borderRadius="sm" maxWidth="10rem">
            <Image
              alt=""
              src={urlFor(image).width(300).height(200).url()}
              width={300}
              height={200}
            />
          </Box>
        )}
        <Box padding=".75rem 1rem .75rem .5rem">
          <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
            <Link href={`/aktiviteter/${slug}`}>
              <Flex alignItems="center" gap=".5rem">
                <Heading as="h3" size="md">
                  {title}
                </Heading>
              </Flex>
            </Link>
          </LinkOverlay>
          {location && (
            <Text display="flex" alignItems="center" gap=".25em" fontSize="sm">
              <MapPin size="1em" />
              {location?.name}
            </Text>
          )}
        </Box>
      </Stack>
    </LinkBox>
  );
};

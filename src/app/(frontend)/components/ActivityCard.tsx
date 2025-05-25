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
import { MapPin, AlertCircle } from "react-feather";
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
  cancelled?: boolean;
  note?: string;
};

export const ActivityCard = (props: Props) => {
  const { startsAt, endsAt, title, location, slug, image } = props;
  if (!startsAt) return null;

  return (
    <LinkBox
      display="flex"
      borderRadius="md"
      backgroundColor={props.cancelled ? "red.100" : "green.100"}
      gap=".5rem"
      _hover={{ backgroundColor: props.cancelled ? "red.200" : "green.200" }}
      transition=".3s"
      overflow="hidden"
    >
      <Stack
        justifyContent="center"
        background={props.cancelled ? "red.200" : "green.200"}
        gap="0"
        padding={{ base: ".5rem", sm: ".75rem 1rem" }}
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
        <Stack
          gap=".25rem"
          padding={{ base: ".5rem", sm: ".75rem 1rem .75rem .5rem" }}
        >
          {props.cancelled && (
            <Flex
              fontSize="sm"
              fontWeight={600}
              color="red.600"
              align="center"
              gap=".25em"
            >
              <AlertCircle size="1em" />
              <Text>Avlyst</Text>
            </Flex>
          )}
          <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
            <Link href={`/aktiviteter/${slug}`}>
              <Heading as="h3" size={{ base: "sm", sm: "md" }}>
                {title}
              </Heading>
            </Link>
          </LinkOverlay>
          {location && (
            <Text display="flex" alignItems="center" gap=".25em" fontSize="sm">
              <MapPin size="1em" />
              {location?.name}
            </Text>
          )}
          {props.note && (
            <Text fontSize="sm" maxWidth="30rem">
              {props.note}
            </Text>
          )}
        </Stack>
      </Stack>
    </LinkBox>
  );
};

import { formatNorwegianDate } from "@/utils/date";
import { urlFor } from "@/sanity/lib/image";
import {
  Box,
  BoxProps,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
  Flex,
  Stack,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "react-feather";
import { ActivitiesQueryResult } from "../../../../sanity.types";

export type Data = Extract<
  ActivitiesQueryResult["eventsAndSessionSeries"][number],
  { _type: "event" }
>;

export const EventCard = ({
  event,
  ...chakraProps
}: { event: Data } & BoxProps) => {
  if (!event) return null;
  const { startsAt } = event;
  if (!startsAt) return null;

  return (
    <LinkBox
      borderRadius="md"
      backgroundColor="green.100"
      display="flex"
      _hover={{ backgroundColor: "green.200" }}
      transition=".3s"
      overflow="hidden"
      {...chakraProps}
    >
      <Stack
        background="green.200"
        gap="0"
        padding=".75rem 1rem"
        fontWeight={600}
        alignItems="center"
        justifyContent="center"
      >
        <Box>{formatNorwegianDate(startsAt, "p")}</Box>
        <Box lineHeight={0.5}>-</Box>
        <Box>{formatNorwegianDate(event.endsAt, "p")}</Box>
      </Stack>
      <Flex gap=".5rem" padding=".75rem 1rem .75rem .75rem">
        {event?.images?.[0] && (
          <Box asChild borderRadius="sm" maxWidth="10rem">
            <Image
              alt=""
              src={urlFor(event.images[0]).width(300).height(200).url()}
              width={300}
              height={200}
            />
          </Box>
        )}
        <Box>
          <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
            <Link href={`/aktiviteter/${event._id}`}>
              <Heading as="h3">{event.title}</Heading>
            </Link>
          </LinkOverlay>
          {event.location && (
            <Text display="flex" alignItems="center" gap=".25em" fontSize="sm">
              <MapPin /> {event.location?.name}
            </Text>
          )}
        </Box>
      </Flex>
    </LinkBox>
  );
};

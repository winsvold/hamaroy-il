import { formatNorwegianDate } from "@/utils/date";
import {
  Box,
  BoxProps,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { Clock, MapPin } from "react-feather";
import { ActivitiesQueryResult } from "../../../../sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export type Data = ActivitiesQueryResult["events"][number];

export const EventCard = ({
  event,
  ...chakraProps
}: { event: Data } & BoxProps) => {
  if (!event) return null;
  const { startsAt } = event;
  if (!startsAt) return null;

  return (
    <LinkBox
      display="flex"
      padding="1rem"
      borderRadius="md"
      backgroundColor="blue.100"
      gap=".5rem"
      alignItems="flex-start"
      _hover={{ backgroundColor: "blue.200" }}
      transition=".3s"
      {...chakraProps}
    >
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
      <Flex
        flexDirection="column"
        as="p"
        padding=".5rem"
        minWidth="3.5rem"
        textAlign="center"
        alignItems="center"
        borderRadius="md"
        backgroundColor="blackAlpha.200"
        fontWeight={600}
        lineHeight={1}
        title={formatNorwegianDate(startsAt, "PPP p")}
        fontSize="0.9rem"
      >
        <Box as="span">{formatNorwegianDate(startsAt, "E")}</Box>
        <Box as="span" fontSize="1.5em">
          {formatNorwegianDate(startsAt, "d")}
        </Box>
        <Box as="span">
          {formatNorwegianDate(startsAt, "MMM").replace(".", "")}
        </Box>
      </Flex>
      <Box>
        <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
          <Link href={`/aktiviteter/${event._id}`}>
            <Heading as="h3">{event.title}</Heading>{" "}
          </Link>
        </LinkOverlay>
        <Text fontWeight={600} display="flex" alignItems="center" gap=".5em">
          <Clock />
          {formatNorwegianDate(startsAt, "p")} -{" "}
          {formatNorwegianDate(event.endsAt, "p")}
        </Text>
        <Text
          _hover={{ textDecoration: "underline" }}
          display="flex"
          alignItems="center"
          gap=".5em"
        >
          <MapPin /> {event.location?.name}
        </Text>
      </Box>
    </LinkBox>
  );
};

import { urlFor } from "@/sanity/lib/image";
import { formatNorwegianDate } from "@/utils/date";
import {
  Box,
  BoxProps,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "react-feather";
import { ActivitiesQueryResult } from "../../../../sanity.types";

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
      padding=".75rem"
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

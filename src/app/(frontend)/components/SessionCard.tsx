import { formatNorwegianDate } from "@/utils/date";
import { getSessionEndsAt } from "@/utils/session";
import { sports } from "@/utils/sports";
import {
  Box,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { Clock, MapPin } from "react-feather";
import { KeyedSegment } from "sanity";
import { Session, SessionsSeriesQueryResult } from "../../../../sanity.types";

export type SessionOccurrence = Session &
  KeyedSegment & {
    series: SessionsSeriesQueryResult[number];
  };

export const SessionCard = ({ session }: { session: SessionOccurrence }) => {
  if (!session) return null;
  const { startsAt } = session;
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
    >
      <Flex
        flexDirection="column"
        as="p"
        padding=".5rem"
        minWidth="3.5rem"
        textAlign="center"
        borderRadius="md"
        backgroundColor="blackAlpha.200"
        fontWeight={600}
        lineHeight={1.2}
        title={formatNorwegianDate(startsAt, "PPP p")}
        fontSize="0.9rem"
      >
        <Box as="span" fontSize="1.5em">
          {formatNorwegianDate(startsAt, "d")}
        </Box>
        <Box as="span">{formatNorwegianDate(startsAt, "MMM")}</Box>
      </Flex>
      <Box>
        <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
          <Link href={`/aktiviteter/${session.series.slug?.current}`}>
            <Flex alignItems="center" gap=".5rem">
              <Heading as="h3">{session.series.title}</Heading>{" "}
              {session.series.sport && sports[session.series.sport].icon}
            </Flex>
          </Link>
        </LinkOverlay>
        <Text fontWeight={600} display="flex" alignItems="center" gap=".5em">
          <Clock />
          {formatNorwegianDate(startsAt, "p")} -{" "}
          {formatNorwegianDate(getSessionEndsAt(session), "p")}
        </Text>
        <Text
          _hover={{ textDecoration: "underline" }}
          asChild
          display="flex"
          alignItems="center"
          gap=".5em"
        >
          <Link href={`/lokaler/${session.series.location?.slug?.current}`}>
            <MapPin /> {session.series.location?.name}
          </Link>
        </Text>
      </Box>
    </LinkBox>
  );
};

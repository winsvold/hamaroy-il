import { formatNorwegianDate } from "@/utils/date";
import { getSessionEndsAt } from "@/utils/session";
import { sports } from "@/utils/sports";
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
import { SessionOccurrence } from "./activities";

export const SessionCard = ({ session }: { session: SessionOccurrence }) => {
  if (!session) return null;
  const { startsAt } = session;
  if (!startsAt) return null;

  return (
    <LinkBox
      display="flex"
      borderRadius="md"
      backgroundColor="green.100"
      gap=".5rem"
      alignItems="flex-start"
      _hover={{ backgroundColor: "green.200" }}
      transition=".3s"
      overflow="hidden"
    >
      <Stack
        background="green.200"
        gap="0"
        padding=".75rem 1rem"
        fontWeight={600}
        alignItems="center"
      >
        <Box>{formatNorwegianDate(startsAt, "p")}</Box>
        <Box lineHeight={0.5}>-</Box>
        <Box>{formatNorwegianDate(getSessionEndsAt(session), "p")}</Box>
      </Stack>
      <Box padding=".75rem 1rem .75rem .5rem">
        <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
          <Link href={`/aktiviteter/${session.series.slug?.current}`}>
            <Flex alignItems="center" gap=".5rem">
              <Heading as="h3" size="md">
                {session.series.title}
              </Heading>{" "}
              {session.series.sport && sports[session.series.sport].icon}
            </Flex>
          </Link>
        </LinkOverlay>
        {session.series.location && (
          <Text display="flex" alignItems="center" gap=".25em" fontSize="sm">
            <MapPin size="1em" />
            {session.series.location?.name}
          </Text>
        )}
      </Box>
    </LinkBox>
  );
};

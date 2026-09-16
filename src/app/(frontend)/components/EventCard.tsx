import { LinkCard, LinkCardTitle } from "@/components/LinkCard";
import { urlFor } from "@/sanity/lib/image";
import {
  formatNorwegianAbbreviation,
  formatNorwegianDate,
  formatNorwegianTimeRange,
} from "@/utils/date";
import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { FrontPageQueryResult } from "../../../../sanity.types";
import { MountainRange } from "../layout/MountainRange";

type Event = FrontPageQueryResult["events"][number];

export const EventCard = ({
  _id,
  title,
  startsAt,
  endsAt,
  location,
  image,
}: Event) => (
  <LinkCard display="flex" flexDirection="column">
    <EventImage image={image} />
    <Flex gap="1rem" padding="1rem">
      <Box flex="1" minWidth="0">
        <LinkCardTitle href={`/aktiviteter/${_id}`} fontSize="md">
          {title}
        </LinkCardTitle>
        <Text
          fontSize="sm"
          fontWeight="bold"
          color="deep.base"
          marginTop=".5rem"
        >
          {formatNorwegianTimeRange(startsAt, endsAt)}
        </Text>
        {location?.name && (
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="secondary"
            marginTop=".25rem"
          >
            {location.name}
          </Text>
        )}
      </Box>
      {startsAt && <DateChip date={startsAt} />}
    </Flex>
  </LinkCard>
);

const imageHeight = "9rem";

/** Bildet, eller nordlys bak fjellrekka når arrangementet mangler bilde */
const EventImage = ({ image }: { image: Event["image"] }) =>
  image ? (
    <Box
      asChild
      width="100%"
      height={imageHeight}
      flexShrink={0}
      objectFit="cover"
    >
      <Image
        alt=""
        src={urlFor(image).width(800).height(300).url()}
        width={800}
        height={300}
      />
    </Box>
  ) : (
    <Box
      position="relative"
      height={imageHeight}
      flexShrink={0}
      overflow="hidden"
      backgroundImage="radial-gradient(90% 70% at 60% 100%, rgba(74, 222, 159, 0.4), rgba(74, 222, 159, 0.1) 40%, transparent 65%), linear-gradient(#0a1f1a, #123a32)"
      aria-hidden="true"
    >
      <MountainRange back="arctic.base" front="arctic.base" height="2.5rem" />
    </Box>
  );

const DateChip = ({ date }: { date: string }) => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    flexShrink={0}
    boxSize="3rem"
    background="aurora.green"
    color="onAuroraSoft"
    textStyle="kicker"
    lineHeight={1}
    title={formatNorwegianDate(date, "PPP")}
  >
    <span>{formatNorwegianAbbreviation(date, "EEE")}</span>
    <Box
      as="span"
      fontSize="xl"
      fontWeight="extrabold"
      letterSpacing="normal"
      color="onAurora"
    >
      {formatNorwegianDate(date, "d")}
    </Box>
    <span>{formatNorwegianAbbreviation(date, "MMM")}</span>
  </Flex>
);

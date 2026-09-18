import { DateBadge } from "@/components/DateBadge";
import { LinkCard, LinkCardTitle } from "@/components/LinkCard";
import { urlFor } from "@/sanity/lib/image";
import { formatNorwegianTimeRange } from "@/utils/date";
import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { FrontPageQueryResult } from "../../../../sanity.types";

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

/** Bildet, eller en farget flate når arrangementet mangler bilde */
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
    <Box height={imageHeight} flexShrink={0} background="sage.deep" />
  );

const DateChip = ({ date }: { date: string }) => (
  <DateBadge
    date={date}
    daySize="xl"
    dayColor="onAurora"
    boxSize="3rem"
    background="aurora.green"
    color="onAuroraSoft"
    textStyle="kicker"
    lineHeight={1}
  />
);

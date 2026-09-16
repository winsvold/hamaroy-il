import { urlFor } from "@/sanity/lib/image";
import { formatNorwegianDate, formatNorwegianTimeRange } from "@/utils/date";
import {
  Box,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { FrontPageQueryResult } from "../../../../sanity.types";
import { MountainRange } from "../layout/MountainRange";

const DateChip = ({ date }: { date: string }) => (
  <Flex
    flexDirection="column"
    align="center"
    justify="center"
    flexShrink={0}
    width="3rem"
    height="3rem"
    background="aurora.green"
    color="onAuroraSoft"
    lineHeight={1}
    title={formatNorwegianDate(date, "PPP")}
  >
    <Box
      as="span"
      fontSize="2xs"
      fontWeight="bold"
      letterSpacing="widest"
      textTransform="uppercase"
    >
      {formatNorwegianDate(date, "E").replace(".", "")}
    </Box>
    <Box as="span" fontWeight="extrabold" fontSize="xl" color="onAurora">
      {formatNorwegianDate(date, "d")}
    </Box>
    <Box
      as="span"
      fontSize="2xs"
      fontWeight="bold"
      letterSpacing="widest"
      textTransform="uppercase"
    >
      {formatNorwegianDate(date, "MMM").replace(".", "")}
    </Box>
  </Flex>
);

const ImagePlaceholder = () => (
  <Box
    position="relative"
    height="9rem"
    flexShrink={0}
    overflow="hidden"
    backgroundImage="linear-gradient(#0a1f1a, #123a32)"
    aria-hidden="true"
  >
    <Box
      position="absolute"
      inset="0"
      backgroundImage="radial-gradient(90% 70% at 60% 100%, rgba(74, 222, 159, 0.4) 0%, rgba(74, 222, 159, 0.1) 42%, transparent 66%)"
    />
    <MountainRange back="arctic.base" front="arctic.base" height="2.5rem" />
  </Box>
);

export const EventCard = (props: FrontPageQueryResult["events"][number]) => {
  const { startsAt, endsAt, title, location } = props;
  const image = props.images?.[0];

  return (
    <LinkBox
      display="flex"
      flexDirection="column"
      background="card.base"
      transition="background .2s"
      _hover={{ background: "card.hover", "& h3": { color: "deep.base" } }}
    >
      {image ? (
        <Box width="100%" height="9rem" flexShrink={0} overflow="hidden">
          <Box asChild width="100%" height="100%" objectFit="cover">
            <Image
              alt=""
              src={urlFor(image).width(800).height(300).url()}
              width={800}
              height={300}
            />
          </Box>
        </Box>
      ) : (
        <ImagePlaceholder />
      )}
      <Flex gap="1rem" padding="1rem">
        <Box flex="1" minWidth="0">
          <LinkOverlay asChild>
            <Link href={`/aktiviteter/${props._id}`}>
              <Heading
                as="h3"
                fontFamily="body"
                fontWeight="bold"
                fontSize="md"
                lineHeight={1.25}
                color="ink"
                transition="color .2s"
              >
                {title}
              </Heading>
            </Link>
          </LinkOverlay>
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
    </LinkBox>
  );
};

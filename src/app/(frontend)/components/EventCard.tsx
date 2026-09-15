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

/**
 * Datobrikka øverst til høyre på kortet: ukedag over dag over måned. Den grønne
 * brikka er det som får kortene til å skille seg ut; kortet selv holder seg lyst.
 */
const DateChip = ({ date }: { date: string }) => (
  <Flex
    flexDirection="column"
    align="center"
    justify="center"
    flexShrink={0}
    width="3.25rem"
    height="3.25rem"
    background="aurora.green"
    color="onAuroraSoft"
    lineHeight={1.1}
    title={formatNorwegianDate(date, "PPP")}
  >
    <Box
      as="span"
      fontSize="0.5625rem"
      fontWeight={700}
      letterSpacing=".12em"
      textTransform="uppercase"
    >
      {formatNorwegianDate(date, "E").replace(".", "")}
    </Box>
    <Box as="span" fontWeight={800} fontSize="1.3125rem" color="onAurora">
      {formatNorwegianDate(date, "d")}
    </Box>
    <Box
      as="span"
      fontSize="0.5625rem"
      fontWeight={700}
      letterSpacing=".12em"
      textTransform="uppercase"
    >
      {formatNorwegianDate(date, "MMM").replace(".", "")}
    </Box>
  </Flex>
);

/**
 * Arrangementer uten bilde får nordlys bak fjellrekka i stedet: den samme silhuetten
 * som i toppfeltet, mørk mot en opplyst himmel. Samme høyde som et bilde, så kortene
 * i en rad står likt.
 *
 * Designet tegnet en forenklet kopi av rekka her. Den ekte banene i liten skala gir
 * nesten samme form, og holder silhuetten ett sted.
 */
const ImagePlaceholder = () => (
  <Box
    position="relative"
    height="8.75rem"
    flexShrink={0}
    overflow="hidden"
    // Himmelen er egne mørkegrønne toner som bare brukes her
    backgroundImage="linear-gradient(#0a1f1a, #123a32)"
    aria-hidden="true"
  >
    <Box
      position="absolute"
      inset="0"
      backgroundImage="radial-gradient(90% 70% at 60% 100%, rgba(74, 222, 159, 0.4) 0%, rgba(74, 222, 159, 0.1) 42%, transparent 66%)"
    />
    <MountainRange back="arctic.base" front="arctic.base" height="2.625rem" />
  </Box>
);

/**
 * Kortet i «Gå ikke glipp av». Arrangementer skjer sjelden sammenlignet med de faste
 * treningene, så de får bilde og mer plass enn en rad i kalenderen.
 */
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
        <Box width="100%" height="8.75rem" flexShrink={0} overflow="hidden">
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
      <Flex gap=".875rem" padding="1rem 1.125rem 1.125rem">
        <Box flex="1" minWidth="0">
          <LinkOverlay asChild>
            <Link href={`/aktiviteter/${props._id}`}>
              <Heading
                as="h3"
                fontFamily="body"
                fontWeight={700}
                fontSize="0.96875rem"
                lineHeight={1.3}
                color="ink"
                transition="color .2s"
              >
                {title}
              </Heading>
            </Link>
          </LinkOverlay>
          <Text
            fontSize="0.8125rem"
            fontWeight={700}
            color="deep.base"
            marginTop=".5rem"
          >
            {formatNorwegianTimeRange(startsAt, endsAt)}
          </Text>
          {location?.name && (
            <Text
              fontSize="0.8125rem"
              fontWeight={500}
              color="secondary"
              marginTop=".1875rem"
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

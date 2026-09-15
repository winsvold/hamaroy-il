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

/** Datobrikka øverst til høyre på kortet: ukedag over dag over måned. */
const DateChip = ({ date }: { date: string }) => (
  <Flex
    flexDirection="column"
    align="center"
    justify="center"
    flexShrink={0}
    width="3.25rem"
    height="3.25rem"
    background="aurora.tint"
    color="deep.base"
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
    <Box
      as="span"
      fontFamily="heading"
      fontWeight={800}
      fontSize="1.3125rem"
      color="arctic.base"
    >
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
 * Kortet i «Gå ikke glipp av». Arrangementer skjer sjelden sammenlignet med de faste
 * treningene, så de får bilde og mer plass enn et kort i kalenderen.
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
      {image && (
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
      )}
      {/*
        Uten bilde skyves innholdet ned til bunnen av kortet. Rutenettet strekker alle
        kortene like høye, og da ville et bildeløst kort ellers stått med teksten på
        toppen mens naboene har sin nederst — hele raden ser da ujevn ut.
      */}
      <Flex
        gap=".875rem"
        padding="1rem 1.125rem 1.125rem"
        marginTop={image ? undefined : "auto"}
        alignItems={image ? undefined : "flex-end"}
      >
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
            fontSize="0.78125rem"
            fontWeight={600}
            color="secondary"
            marginTop=".5rem"
          >
            {formatNorwegianTimeRange(startsAt, endsAt)}
          </Text>
          {location?.name && (
            <Text
              fontSize="0.78125rem"
              fontWeight={500}
              color="muted"
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

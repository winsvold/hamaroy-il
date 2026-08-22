import { urlFor } from "@/sanity/lib/image";
import { resolveSport } from "@/sanity/sports";
import { formatNorwegianDate } from "@/utils/date";
import {
  Box,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "react-feather";
import { FrontPageQueryResult } from "../../../../sanity.types";
import { TextWithIcon } from "./CalendarCard";
import { DatoBadge } from "./calendar";

/**
 * Det store kortet i «Gå ikke glipp av». Arrangementer skjer sjelden sammenlignet med
 * de faste treningene, så de får bilde og mer plass enn en rad i tidslinja.
 */
export const EventCard = (props: FrontPageQueryResult["events"][number]) => {
  const { startsAt, endsAt, title, location } = props;
  const image = props.images?.[0];
  const sport = resolveSport(props);

  return (
    <LinkBox
      display="flex"
      flexDirection="column"
      background="surface"
      border="1px solid"
      borderColor="hairline"
      borderRadius="2xl"
      overflow="hidden"
      transition="border-color .2s, transform .2s"
      _hover={{
        borderColor: "hairlineStrong",
        transform: "translateY(-0.125rem)",
      }}
    >
      {/*
        Bildefeltet står alltid, også uten bilde — ellers får kort uten bilde innholdet
        klistret til toppen mens naboene i rutenettet er strukket like høye, og raden
        ser ødelagt ut. Uten bilde fylles feltet med idrettsikonet.
      */}
      <Box width="100%" aspectRatio={2} background="forest.50" flexShrink={0}>
        {image ? (
          <Box asChild width="100%" height="100%" objectFit="cover">
            <Image
              alt=""
              src={urlFor(image).width(600).height(300).url()}
              width={600}
              height={300}
            />
          </Box>
        ) : (
          <Flex
            height="100%"
            align="center"
            justify="center"
            fontSize="3rem"
            opacity={0.55}
            aria-hidden="true"
          >
            {sport?.emoji ?? "📅"}
          </Flex>
        )}
      </Box>
      <Flex gap="1rem" padding="1.1rem" alignItems="flex-start" flex="1">
        {startsAt && <DatoBadge date={startsAt} flexShrink={0} />}
        <Stack gap=".35rem" flex="1" minWidth="0">
          <Flex gap=".5rem" align="center">
            {sport && (
              <Box fontSize="1rem" aria-hidden="true">
                {sport.emoji}
              </Box>
            )}
            <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
              <Link href={`/aktiviteter/${props._id}`}>
                <Heading
                  as="h3"
                  fontFamily="heading"
                  fontWeight={800}
                  fontSize="1.15rem"
                  lineHeight={1.2}
                  color="forest.700"
                >
                  {title}
                </Heading>
              </Link>
            </LinkOverlay>
          </Flex>
          <Text fontSize="0.85rem" fontWeight={600} color="muted">
            {formatNorwegianDate(startsAt, "p")}–
            {formatNorwegianDate(endsAt, "p")}
          </Text>
          {location && (
            <TextWithIcon
              fontSize="0.8rem"
              color="muted"
              icon={<MapPin size="1em" />}
            >
              {location?.name}
            </TextWithIcon>
          )}
          <Box
            marginTop=".35rem"
            fontSize="0.78rem"
            fontWeight={700}
            color="amber.700"
          >
            Les mer →
          </Box>
        </Stack>
      </Flex>
    </LinkBox>
  );
};

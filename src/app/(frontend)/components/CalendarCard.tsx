import { urlFor } from "@/sanity/lib/image";
import { Sport } from "@/sanity/sports";
import { formatNorwegianDate } from "@/utils/date";
import {
  Box,
  Flex,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  TextProps,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle } from "react-feather";
import { Event, Location } from "../../../../sanity.types";

type Props = {
  startsAt?: string;
  endsAt?: string;
  title?: string;
  location: Location | null;
  slug?: string;
  image?: NonNullable<Event["images"]>[0];
  cancelled?: boolean;
  note?: string;
  sport?: Sport;
  /**
   * På en aktivitets egen side er tittelen den samme for hver sesjon, og lenka peker
   * til siden du allerede står på. Da vises tid og sted alene, uten lenke.
   */
  hideTitle?: boolean;
  type: "event" | "session";
};

/** «18:00–19:30 · Klatrevegg, Hamarøyhallen» */
const meta = (props: Props) => {
  const time = [
    formatNorwegianDate(props.startsAt, "p"),
    props.endsAt && formatNorwegianDate(props.endsAt, "p"),
  ]
    .filter(Boolean)
    .join("–");

  return [time, props.location?.name].filter(Boolean).join(" · ");
};

export const CalendarCard = (props: Props) => {
  const { startsAt, title, slug, image, cancelled } = props;
  if (!startsAt) return null;

  // Bilde bare på arrangementer — faste treninger gjentar seg og får idrettsikonet i stedet
  const thumbnail = props.type === "event" && image;

  return (
    <LinkBox
      display="flex"
      alignItems="center"
      gap=".9rem"
      width="100%"
      background={cancelled ? "amber.50" : "surface"}
      border="1px solid"
      borderColor={cancelled ? "amber.300" : "hairline"}
      borderRadius="xl"
      padding=".85rem 1rem"
      transition="border-color .2s, background .2s"
      _hover={{ borderColor: cancelled ? "amber.500" : "hairlineStrong" }}
    >
      <Stack gap=".15rem" flex="1" minWidth="0">
        {cancelled && (
          <TextWithIcon
            fontSize="0.75rem"
            fontWeight={700}
            color="amber.800"
            textTransform="uppercase"
            letterSpacing=".04em"
            icon={<AlertCircle size="1em" />}
          >
            Avlyst
          </TextWithIcon>
        )}
        {props.hideTitle ? (
          <Text
            fontWeight={700}
            fontSize="0.95rem"
            color="forest.700"
            textDecoration={cancelled ? "line-through" : undefined}
          >
            {meta(props)}
          </Text>
        ) : (
          <>
            <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
              <Link href={`/aktiviteter/${slug}`}>
                <Heading
                  as="h3"
                  fontFamily="body"
                  fontWeight={700}
                  fontSize="1rem"
                  lineHeight={1.3}
                  color="forest.700"
                  textDecoration={cancelled ? "line-through" : undefined}
                >
                  {title}
                </Heading>
              </Link>
            </LinkOverlay>
            <Text fontSize="0.8rem" fontWeight={500} color="muted">
              {meta(props)}
            </Text>
          </>
        )}
        {props.note && (
          <Text
            fontSize="0.8rem"
            color="muted"
            maxWidth="30rem"
            marginTop=".2rem"
          >
            {props.note}
          </Text>
        )}
      </Stack>

      {thumbnail ? (
        <Box
          asChild
          flexShrink={0}
          borderRadius="sm"
          width="4rem"
          height="4rem"
          objectFit="cover"
        >
          <Image
            alt=""
            src={urlFor(image).width(160).height(160).url()}
            width={160}
            height={160}
          />
        </Box>
      ) : (
        // Ikonet skiller idretter fra hverandre i en blandet liste. På en aktivitets
        // egen side er alle radene samme idrett, så da er det bare støy.
        props.sport &&
        !props.hideTitle && (
          <Flex
            flexShrink={0}
            fontSize="1.375rem"
            lineHeight={1}
            aria-hidden="true"
          >
            {props.sport.emoji}
          </Flex>
        )
      )}
    </LinkBox>
  );
};

export const TextWithIcon = ({
  icon,
  children,
  ...chakraProps
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
} & TextProps) => (
  <Text display="flex" alignItems="center" gap=".5em" {...chakraProps}>
    <Icon flexShrink={0}>{icon}</Icon>
    {children}
  </Text>
);

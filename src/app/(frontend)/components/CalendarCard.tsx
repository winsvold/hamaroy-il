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
import Link from "next/link";
import { AlertCircle } from "react-feather";

type Props = {
  startsAt?: string | null;
  endsAt?: string | null;
  title?: string | null;
  /** Bare navnet brukes — spørringen henter derfor ikke hele lokasjonen */
  location?: { name?: string | null } | null;
  slug?: string;
  cancelled?: boolean | null;
  note?: string | null;
  /** Nordlysfargen på prikken. Roterer med posisjonen i lista, som i designet. */
  dotColor: string;
  /**
   * På en aktivitets egen side er tittelen den samme for hver sesjon, og lenka peker
   * til siden du allerede står på. Da vises tid og sted alene, uten lenke.
   */
  hideTitle?: boolean;
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

/**
 * Én rad i tidslinja. Designet droppet kortet rundt hver aktivitet — skillet mellom
 * radene bæres nå av prikken og datokolonnen til venstre.
 */
export const CalendarCard = (props: Props) => {
  const { startsAt, title, slug, cancelled } = props;
  if (!startsAt) return null;

  const dot = (
    <Box
      flexShrink={0}
      width=".4375rem"
      height=".4375rem"
      borderRadius="full"
      marginTop=".45rem"
      background={cancelled ? "muted" : props.dotColor}
    />
  );

  const body = (
    <Stack gap=".1875rem" minWidth="0">
      {cancelled && (
        <TextWithIcon
          textStyle="kicker"
          color="deep.base"
          icon={<AlertCircle size="1em" />}
        >
          Avlyst
        </TextWithIcon>
      )}
      {props.hideTitle ? (
        <Text
          fontWeight={700}
          fontSize="1.0625rem"
          color="ink"
          textDecoration={cancelled ? "line-through" : undefined}
        >
          {meta(props)}
        </Text>
      ) : (
        <>
          <LinkOverlay asChild>
            <Link href={`/aktiviteter/${slug}`}>
              <Heading
                as="h3"
                fontFamily="body"
                fontWeight={700}
                fontSize="1.125rem"
                lineHeight={1.28}
                color="ink"
                transition="color .2s"
                textDecoration={cancelled ? "line-through" : undefined}
              >
                {title}
              </Heading>
            </Link>
          </LinkOverlay>
          <Text fontSize="0.8125rem" fontWeight={500} color="muted">
            {meta(props)}
          </Text>
        </>
      )}
      {props.note && (
        <Text fontSize="0.8125rem" color="muted" maxWidth="30rem">
          {props.note}
        </Text>
      )}
    </Stack>
  );

  if (props.hideTitle)
    return (
      <Flex gap=".75rem" alignItems="flex-start">
        {dot}
        {body}
      </Flex>
    );

  return (
    <LinkBox
      display="flex"
      gap=".75rem"
      alignItems="flex-start"
      _hover={{ "& h3": { color: "deep.base" } }}
    >
      {dot}
      {body}
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

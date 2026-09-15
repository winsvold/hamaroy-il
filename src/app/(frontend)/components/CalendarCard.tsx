import {
  formatNorwegianDate,
  formatNorwegianDuration,
  isSameNorwegianDay,
} from "@/utils/date";
import {
  Box,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  TextProps,
} from "@chakra-ui/react";
import Link from "next/link";
import { AlertCircle, MapPin } from "react-feather";

type Props = {
  startsAt?: string | null;
  endsAt?: string | null;
  title?: string | null;
  /** Bare navnet brukes — spørringen henter derfor ikke hele lokasjonen */
  location?: { name?: string | null } | null;
  slug?: string;
  cancelled?: boolean | null;
  note?: string | null;
  /**
   * På en aktivitets egen side er tittelen den samme for hver sesjon, og lenka peker
   * til siden du allerede står på. Da vises bare tid og sted, uten lenke.
   */
  hideTitle?: boolean;
};

/**
 * «1t 30m» under starttiden. Varer aktiviteten over midnatt, feks et todagerskurs, står
 * sluttidspunktet der i stedet — designet traff bare aktiviteter innenfor én dag.
 */
const durationLabel = (startsAt: string, endsAt?: string | null) => {
  if (!endsAt) return null;
  return isSameNorwegianDay(startsAt, endsAt)
    ? formatNorwegianDuration(startsAt, endsAt)
    : `til ${formatNorwegianDate(endsAt, "EEE p")}`;
};

/**
 * Designet er tegnet for desktop. På mobil ble det bare ~150 px igjen til navnet ved
 * siden av datobrikka og tidsblokken, og ord som «Hamarøyhallen» brakk midt i. Der
 * legger tidsblokken seg i stedet som en stripe over navnet.
 */
const rowStyles = {
  display: "flex",
  flexDirection: { base: "column", sm: "row" },
  alignItems: "stretch",
  maxWidth: "100%",
  background: "card.base",
} as const;

/**
 * Én rad i tidslinja: klokkeslettet i en dypgrønn blokk, navn og sted ved siden av.
 * Raden er bare så bred som innholdet, så en kort tittel gir en kort rad.
 *
 * Tallene står i Figtree med tabellsifre. Syne kostet lesbarhet, og tidspunktet er
 * det én ting en klubbkalender må kunne leses på et øyeblikk.
 */
export const CalendarCard = (props: Props) => {
  const { startsAt, cancelled } = props;
  if (!startsAt) return null;

  const place = props.location?.name;
  const strike = cancelled ? "line-through" : undefined;

  const content = (
    <>
      <Flex
        direction={{ base: "row", sm: "column" }}
        align={{ base: "baseline", sm: "center" }}
        justify={{ base: "flex-start", sm: "center" }}
        gap={{ base: ".625rem", sm: "0" }}
        flexShrink={0}
        width={{ base: "auto", sm: "5rem", md: "6.5rem" }}
        paddingY={{ base: ".5rem", sm: "1rem" }}
        paddingX={{ base: "1rem", sm: ".5rem" }}
        background="deep.base"
        textAlign="center"
      >
        <Box
          fontWeight={700}
          fontSize={{ base: "1.0625rem", sm: "1.25rem" }}
          lineHeight={1.1}
          fontVariantNumeric="tabular-nums"
          whiteSpace="nowrap"
          color="onDark.base"
          textDecoration={strike}
        >
          {formatNorwegianDate(startsAt, "p")}
        </Box>
        <Text
          fontSize="0.8125rem"
          fontWeight={600}
          color="deep.light"
          marginTop={{ base: "0", sm: ".1875rem" }}
        >
          {durationLabel(startsAt, props.endsAt)}
        </Text>
      </Flex>
      <Stack
        gap=".375rem"
        justify="center"
        minWidth="0"
        padding={{
          base: ".75rem 1rem .875rem",
          md: ".9375rem 1.375rem .9375rem 1.25rem",
        }}
      >
        {cancelled && (
          <TextWithIcon
            textStyle="kicker"
            color="deep.base"
            icon={<AlertCircle size="1em" />}
          >
            Avlyst
          </TextWithIcon>
        )}
        {!props.hideTitle && props.title && (
          <Text
            data-name
            fontWeight={700}
            fontSize="1.0625rem"
            lineHeight={1.32}
            color="ink"
            transition="color .2s"
            textDecoration={strike}
          >
            <LinkOverlay asChild>
              <Link href={`/aktiviteter/${props.slug}`}>{props.title}</Link>
            </LinkOverlay>
          </Text>
        )}
        {place && (
          <TextWithIcon
            icon={<MapPin size="1.07em" />}
            gap=".4375rem"
            fontSize="0.875rem"
            fontWeight={500}
            color="secondary"
            css={{ "& svg": { color: "muted" } }}
          >
            {place}
          </TextWithIcon>
        )}
        {props.note && (
          <Text fontSize="0.8125rem" color="muted">
            {props.note}
          </Text>
        )}
      </Stack>
    </>
  );

  if (props.hideTitle) return <Flex {...rowStyles}>{content}</Flex>;

  return (
    <LinkBox
      {...rowStyles}
      transition="background .2s"
      _hover={{
        background: "card.hover",
        "& [data-name]": { color: "deep.base" },
      }}
    >
      {content}
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

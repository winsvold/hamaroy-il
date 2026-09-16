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
  location?: { name?: string | null } | null;
  slug?: string;
  cancelled?: boolean | null;
  note?: string | null;
  /** Viser bare tid og sted, uten lenke */
  hideTitle?: boolean;
};

/** «1t 30m», eller sluttiden når aktiviteten varer over midnatt */
const durationLabel = (startsAt: string, endsAt?: string | null) => {
  if (!endsAt) return null;
  return isSameNorwegianDay(startsAt, endsAt)
    ? formatNorwegianDuration(startsAt, endsAt)
    : `til ${formatNorwegianDate(endsAt, "EEE p")}`;
};

export const CalendarCard = (props: Props) => {
  const { startsAt, cancelled } = props;
  if (!startsAt) return null;

  const place = props.location?.name;
  const strike = cancelled ? "line-through" : undefined;

  return (
    <LinkBox
      display="flex"
      flexDirection={{ base: "column", sm: "row" }}
      maxWidth="100%"
      background="card.base"
      transition="background .2s"
      // Uten tittel er det ingen lenke
      _hover={
        props.hideTitle
          ? undefined
          : {
              background: "card.hover",
              "& [data-name]": { color: "deep.base" },
            }
      }
    >
      <Flex
        direction={{ base: "row", sm: "column" }}
        align={{ base: "baseline", sm: "center" }}
        justify={{ base: "flex-start", sm: "center" }}
        gap={{ base: ".5rem", sm: "0" }}
        flexShrink={0}
        width={{ base: "auto", sm: "5rem", md: "6.5rem" }}
        paddingY={{ base: ".5rem", sm: "1rem" }}
        paddingX={{ base: "1rem", sm: ".5rem" }}
        background="deep.base"
        textAlign="center"
      >
        <Box
          fontWeight="bold"
          fontSize={{ base: "lg", sm: "xl" }}
          lineHeight={1}
          fontVariantNumeric="tabular-nums"
          whiteSpace="nowrap"
          color="onDark.base"
          textDecoration={strike}
        >
          {formatNorwegianDate(startsAt, "p")}
        </Box>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="deep.light"
          marginTop={{ base: "0", sm: ".25rem" }}
        >
          {durationLabel(startsAt, props.endsAt)}
        </Text>
      </Flex>
      <Stack
        gap=".5rem"
        justify="center"
        minWidth="0"
        padding={{
          base: ".75rem 1rem 1rem",
          md: "1rem 1.5rem 1rem 1.25rem",
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
            fontWeight="bold"
            fontSize="lg"
            lineHeight={1.25}
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
            gap=".5rem"
            fontSize="sm"
            fontWeight="medium"
            color="secondary"
            css={{ "& svg": { color: "muted" } }}
          >
            {place}
          </TextWithIcon>
        )}
        {props.note && (
          <Text fontSize="sm" color="muted">
            {props.note}
          </Text>
        )}
      </Stack>
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

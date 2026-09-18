import { LinkCard, LinkCardTitle } from "@/components/LinkCard";
import {
  formatNorwegianDate,
  formatNorwegianDuration,
  isSameNorwegianDay,
} from "@/utils/date";
import { Box, Flex, Icon, Stack, Text, TextProps } from "@chakra-ui/react";
import { AlertCircle, MapPin } from "react-feather";

export type CalendarEntry = {
  id: string;
  startsAt: string;
  endsAt: string | null;
  title: string | null;
  place?: string | null;
  href: string;
  cancelled?: boolean | null;
  note?: string | null;
};

type Props = CalendarEntry & {
  /** Viser bare tid og sted, uten lenke */
  hideTitle?: boolean;
};

export const CalendarCard = ({ hideTitle, ...entry }: Props) => {
  const strike = entry.cancelled ? "line-through" : undefined;
  // Uten tittel er det ingen lenke, og kortet skal ikke se klikkbart ut
  const Card = hideTitle ? Flex : LinkCard;

  return (
    <Card
      display="flex"
      flexDirection={{ base: "column", sm: "row" }}
      maxWidth="100%"
      background="card.base"
    >
      <TimeBlock
        startsAt={entry.startsAt}
        endsAt={entry.endsAt}
        strike={strike}
      />
      <Stack
        gap=".5rem"
        justify="center"
        minWidth="0"
        padding={{ base: "1rem", md: "1rem 1.5rem" }}
      >
        {entry.cancelled && (
          <TextWithIcon
            icon={<AlertCircle size="1em" />}
            textStyle="kicker"
            color="deep.base"
          >
            Avlyst
          </TextWithIcon>
        )}
        {!hideTitle && entry.title && (
          <LinkCardTitle
            as="p"
            href={entry.href}
            fontSize="lg"
            textDecoration={strike}
          >
            {entry.title}
          </LinkCardTitle>
        )}
        {entry.place && (
          <TextWithIcon
            icon={<MapPin size="1em" />}
            fontSize="sm"
            fontWeight="medium"
            color="secondary"
          >
            {entry.place}
          </TextWithIcon>
        )}
        {entry.note && (
          <Text fontSize="sm" color="muted">
            {entry.note}
          </Text>
        )}
      </Stack>
    </Card>
  );
};

/** «1t 30m», eller sluttiden når aktiviteten varer over midnatt */
const durationLabel = (startsAt: string, endsAt: string | null) => {
  if (!endsAt) return null;
  return isSameNorwegianDay(startsAt, endsAt)
    ? formatNorwegianDuration(startsAt, endsAt)
    : `til ${formatNorwegianDate(endsAt, "EEE p")}`;
};

const TimeBlock = ({
  startsAt,
  endsAt,
  strike,
}: {
  startsAt: string;
  endsAt: string | null;
  strike?: string;
}) => (
  <Flex
    direction={{ base: "row", sm: "column" }}
    align={{ base: "baseline", sm: "center" }}
    justify={{ base: "flex-start", sm: "center" }}
    gap={{ base: ".5rem", sm: ".25rem" }}
    flexShrink={0}
    width={{ base: "auto", sm: "5rem", md: "6.5rem" }}
    paddingY={{ base: ".5rem", sm: "1rem" }}
    paddingX={{ base: "1rem", sm: ".5rem" }}
    background="deep.base"
    textAlign="center"
  >
    <Box
      fontSize={{ base: "lg", sm: "xl" }}
      fontWeight="bold"
      lineHeight={1}
      fontVariantNumeric="tabular-nums"
      whiteSpace="nowrap"
      color="onDark.base"
      textDecoration={strike}
    >
      {formatNorwegianDate(startsAt, "p")}
    </Box>
    <Text fontSize="sm" fontWeight="semibold" color="deep.light">
      {durationLabel(startsAt, endsAt)}
    </Text>
  </Flex>
);

const TextWithIcon = ({
  icon,
  children,
  ...props
}: { icon: React.ReactNode; children: React.ReactNode } & TextProps) => (
  <Text display="flex" alignItems="center" gap=".5em" {...props}>
    <Icon flexShrink={0}>{icon}</Icon>
    {children}
  </Text>
);

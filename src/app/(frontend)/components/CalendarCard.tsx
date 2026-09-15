import {
  formatNorwegianDate,
  formatNorwegianDateCapitalized,
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
  /**
   * På en aktivitets egen side er tittelen den samme for hver sesjon, og lenka peker
   * til siden du allerede står på. Da står datoen der navnet ellers står, uten lenke.
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

const cardStyles = {
  display: "flex",
  gap: "1.125rem",
  background: "card.base",
  padding: { base: "1rem 1.125rem", md: "1.25rem 1.375rem" },
} as const;

/**
 * Ett kort i en datobolk: starttid og varighet i en kolonne med fast bredde, så tidene
 * står på linje på tvers av kortene, og navn og sted til høyre for streken.
 */
export const CalendarCard = (props: Props) => {
  const { startsAt, cancelled } = props;
  if (!startsAt) return null;

  const name = props.hideTitle
    ? formatNorwegianDateCapitalized(startsAt, "EEEE d. MMMM")
    : props.title;
  const place = props.location?.name;
  const strike = cancelled ? "line-through" : undefined;

  const content = (
    <>
      {/*
        Syne har brede sifre: «09:00» er 4,7 em, og brakk over to linjer i designets
        66 px-kolonne. Bredden her rommer det bredeste klokkeslettet med litt luft.
      */}
      <Stack
        gap=".1875rem"
        flexShrink={0}
        width="7.125rem"
        paddingRight="1.125rem"
        borderRight="2px solid"
        borderColor="aurora.tint"
      >
        <Box
          fontFamily="heading"
          fontWeight={800}
          fontSize="1.25rem"
          lineHeight={1.1}
          whiteSpace="nowrap"
          color="ink"
          textDecoration={strike}
        >
          {formatNorwegianDate(startsAt, "p")}
        </Box>
        <Text fontSize="0.78125rem" fontWeight={500} color="muted">
          {durationLabel(startsAt, props.endsAt)}
        </Text>
      </Stack>
      <Stack gap=".375rem" minWidth="0">
        {cancelled && (
          <TextWithIcon
            textStyle="kicker"
            color="deep.base"
            icon={<AlertCircle size="1em" />}
          >
            Avlyst
          </TextWithIcon>
        )}
        {name && (
          <Text
            data-name
            fontWeight={700}
            fontSize="1.0625rem"
            lineHeight={1.32}
            color="ink"
            transition="color .2s"
            textDecoration={strike}
          >
            {props.hideTitle ? (
              name
            ) : (
              <LinkOverlay asChild>
                <Link href={`/aktiviteter/${props.slug}`}>{name}</Link>
              </LinkOverlay>
            )}
          </Text>
        )}
        {place && (
          <Text fontSize="0.875rem" fontWeight={500} color="muted">
            {place}
          </Text>
        )}
        {props.note && (
          <Text fontSize="0.8125rem" color="muted">
            {props.note}
          </Text>
        )}
      </Stack>
    </>
  );

  if (props.hideTitle) return <Flex {...cardStyles}>{content}</Flex>;

  return (
    <LinkBox
      {...cardStyles}
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

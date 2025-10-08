import { urlFor } from "@/sanity/lib/image";
import { formatNorwegianDate, formatNorwegianDuration } from "@/utils/date";
import {
  Box,
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
import { AlertCircle, MapPin } from "react-feather";
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
  type: "event" | "session";
};

export const CalendarCard = (props: Props) => {
  const { startsAt, endsAt, title, location, slug, image } = props;
  if (!startsAt) return null;

  const palette = props.type === "session" ? "green" : "blue";

  return (
    <LinkBox
      display="flex"
      borderRadius="md"
      backgroundColor={props.cancelled ? "red.100" : `${palette}.100`}
      gap=".5rem"
      _hover={{
        backgroundColor: props.cancelled ? "red.200" : `${palette}.200`,
      }}
      transition=".3s"
      overflow="hidden"
    >
      <Stack
        justifyContent="center"
        background={props.cancelled ? "red.200" : `${palette}.200`}
        gap="0"
        padding={{ base: ".5rem", sm: ".75rem 1rem" }}
        fontWeight={600}
        alignItems="center"
        lineHeight={1.2}
      >
        <Box>{formatNorwegianDate(startsAt, "p")}</Box>
        <Box fontSize="xs" opacity={0.6}>
          {formatNorwegianDuration(startsAt, endsAt)}
        </Box>
      </Stack>
      <Stack>
        {image && (
          <Box asChild borderRadius="sm" maxWidth="10rem">
            <Image
              alt=""
              src={urlFor(image).width(300).height(200).url()}
              width={300}
              height={200}
            />
          </Box>
        )}
        <Stack
          gap=".25rem"
          padding={{ base: ".5rem", sm: ".75rem 1rem .75rem .5rem" }}
        >
          {props.cancelled && (
            <TextWithIcon
              fontSize="sm"
              fontWeight={600}
              color="red.600"
              icon={<AlertCircle size="1em" />}
            >
              Avlyst
            </TextWithIcon>
          )}
          <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
            <Link href={`/aktiviteter/${slug}`}>
              <Heading
                as="h3"
                size={
                  props.type === "session"
                    ? { base: "sm", sm: "md" }
                    : { base: "md", sm: "lg" }
                }
              >
                {title}
              </Heading>
            </Link>
          </LinkOverlay>
          {location && (
            <TextWithIcon icon={<MapPin size="1em" />}>
              {location?.name}
            </TextWithIcon>
          )}
          {props.note && (
            <Text fontSize="sm" maxWidth="30rem">
              {props.note}
            </Text>
          )}
        </Stack>
      </Stack>
    </LinkBox>
  );
};

const TextWithIcon = ({
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

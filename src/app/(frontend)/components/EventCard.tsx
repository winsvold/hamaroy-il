import { urlFor } from "@/sanity/lib/image";
import { formatNorwegianDate } from "@/utils/date";
import {
  Box,
  Flex,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import { MapPin } from "react-feather";
import { FrontPageQueryResult } from "../../../../sanity.types";
import { TextWithIcon } from "./CalendarCard";
import { DatoBadge } from "./calendar";

export const EventCard = (props: FrontPageQueryResult["events"][number]) => {
  const { startsAt, endsAt, title, location } = props;
  const image = props.images?.[0];

  return (
    <LinkBox
      key={props._id}
      display="flex"
      flexDirection="column"
      borderRadius="md"
      backgroundColor={`blue.100`}
      gap=".75rem"
      _hover={{
        backgroundColor: `blue.200`,
      }}
      transition=".3s"
      overflow="hidden"
      padding=".75rem"
    >
      {image && (
        <Box asChild borderRadius="sm">
          <Image
            alt=""
            src={urlFor(image).width(400).height(200).url()}
            width={400}
            height={200}
          />
        </Box>
      )}
      <Flex gap="1rem" justifyContent="space-between" alignItems="flex-start">
        <Stack>
          <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
            <Link href={`/aktiviteter/${props._id}`}>
              <Heading as="h3" size={{ base: "md", sm: "lg" }}>
                {title}
              </Heading>
            </Link>
          </LinkOverlay>
          <Flex gap=".75rem" fontWeight={600}>
            {formatNorwegianDate(startsAt, "p")} -{" "}
            {formatNorwegianDate(endsAt, "p")}
          </Flex>
        </Stack>
        {startsAt && <DatoBadge date={startsAt} background="blue.600" />}
      </Flex>
      <Stack gap=".25rem">
        {location && (
          <TextWithIcon icon={<MapPin size="1em" />}>
            {location?.name}
          </TextWithIcon>
        )}
      </Stack>
    </LinkBox>
  );
};

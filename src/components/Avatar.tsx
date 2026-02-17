import { urlFor } from "@/sanity/lib/image";
import {
  Box,
  BoxProps,
  Heading,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { Mail, Phone } from "react-feather";
import { Club, Person } from "../../sanity.types";

export const Avatar = ({
  entity,
  ...chakraProps
}: { entity: Person | Club } & BoxProps) => {
  const image = entity._type === "person" ? entity.image : entity.images?.[0];
  const phone = entity._type === "person" ? entity.phone : undefined;
  const email = entity._type === "person" ? entity.email : undefined;
  const name = entity._type === "person" ? entity.name : entity.name;
  const url =
    entity._type === "club" ? `/klubber/${entity.slug?.current}` : undefined;

  return (
    <LinkBox display="flex" gap="1rem" {...chakraProps}>
      {image && (
        <Box asChild borderRadius="50%" height="4rem" width="4rem">
          <Image
            height={200}
            width={200}
            src={urlFor(image).size(200, 200).url()}
            alt={entity.name ?? ""}
          />
        </Box>
      )}
      <Stack gap=".25rem">
        <Heading as="h2" size="md">
          {url ? (
            <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
              <Link href={url}>{name}</Link>
            </LinkOverlay>
          ) : (
            name
          )}
        </Heading>
        <Box>
          {phone && (
            <Text display="flex" alignItems="center" gap=".75em">
              <Phone size="1em" strokeWidth={2.2} />
              <Link href={`tel:${phone}`}>{phone}</Link>
            </Text>
          )}
          {email && (
            <Text display="flex" alignItems="center" gap=".75em">
              <Mail size="1em" strokeWidth={2.2} />
              <Link href={`mailto:${email}`}>{email}</Link>
            </Text>
          )}
        </Box>
      </Stack>
    </LinkBox>
  );
};

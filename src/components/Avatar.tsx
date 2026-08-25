import { urlFor } from "@/sanity/lib/image";
import {
  Box,
  BoxProps,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { Mail, Phone } from "react-feather";
import { Club, Person } from "../../sanity.types";

/**
 * Står både på lyse og mørke kort, så alt arver farge fra kortet framfor å sette sin
 * egen. Kontaktlinjene dempes med gjennomsiktighet, som virker mot begge bakgrunner.
 */
export const Avatar = ({
  entity,
  ...chakraProps
}: { entity: Person | Club } & BoxProps) => {
  const image = entity._type === "person" ? entity.image : entity.images?.[0];
  const phone = entity._type === "person" ? entity.phone : undefined;
  const email = entity._type === "person" ? entity.email : undefined;
  const name = entity.name;
  const url =
    entity._type === "club" ? `/klubber/${entity.slug?.current}` : undefined;

  return (
    <LinkBox display="flex" gap="1rem" color="inherit" {...chakraProps}>
      {image && (
        <Box
          asChild
          height="4rem"
          width="4rem"
          flexShrink={0}
          objectFit="cover"
        >
          <Image
            height={200}
            width={200}
            src={urlFor(image).size(200, 200).url()}
            alt={entity.name ?? ""}
          />
        </Box>
      )}
      <Stack gap=".375rem" minWidth="0">
        {/* Kortets egen tittel er overskriften her — navnet er innhold, ikke nivå */}
        <Box fontWeight={700} fontSize="1rem" color="inherit">
          {url ? (
            <LinkOverlay
              color="inherit"
              _hover={{ textDecoration: "underline" }}
              asChild
            >
              <Link color="inherit" href={url}>
                {name}
              </Link>
            </LinkOverlay>
          ) : (
            name
          )}
        </Box>
        <Box opacity={0.8} fontSize="0.9375rem" lineHeight={1.75}>
          {phone && (
            <Text display="flex" alignItems="center" gap=".75em">
              <Phone size="1em" strokeWidth={2.2} />
              <Link color="inherit" href={`tel:${phone}`}>
                {phone}
              </Link>
            </Text>
          )}
          {email && (
            <Text display="flex" alignItems="center" gap=".75em" minWidth="0">
              <Mail size="1em" strokeWidth={2.2} />
              <Link
                color="inherit"
                href={`mailto:${email}`}
                overflowWrap="anywhere"
              >
                {email}
              </Link>
            </Text>
          )}
        </Box>
      </Stack>
    </LinkBox>
  );
};

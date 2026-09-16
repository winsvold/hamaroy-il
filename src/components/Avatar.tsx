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
import { Icon as FeatherIcon, Mail, Phone } from "react-feather";
import { Club, Person } from "../../sanity.types";

/** Arver farge, siden den står både på lyse og mørke kort */
export const Avatar = ({
  entity,
  ...chakraProps
}: { entity: Person | Club } & BoxProps) => {
  const image = entity._type === "person" ? entity.image : entity.images?.[0];
  const phone = entity._type === "person" ? entity.phone : undefined;
  const email = entity._type === "person" ? entity.email : undefined;
  const url =
    entity._type === "club" ? `/klubber/${entity.slug?.current}` : undefined;

  return (
    <LinkBox display="flex" gap="1rem" {...chakraProps}>
      {image && (
        <Box asChild boxSize="4rem" flexShrink={0} objectFit="cover">
          <Image
            height={200}
            width={200}
            src={urlFor(image).size(200, 200).url()}
            alt={entity.name ?? ""}
          />
        </Box>
      )}
      <Stack gap=".5rem" minWidth="0">
        <Box fontWeight="bold">
          {url ? (
            <LinkOverlay asChild _hover={{ textDecoration: "underline" }}>
              <Link color="inherit" href={url}>
                {entity.name}
              </Link>
            </LinkOverlay>
          ) : (
            entity.name
          )}
        </Box>
        <Box opacity={0.8} lineHeight={1.75}>
          {phone && (
            <ContactLine icon={Phone} href={`tel:${phone}`}>
              {phone}
            </ContactLine>
          )}
          {email && (
            <ContactLine icon={Mail} href={`mailto:${email}`}>
              {email}
            </ContactLine>
          )}
        </Box>
      </Stack>
    </LinkBox>
  );
};

const ContactLine = ({
  icon: Icon,
  href,
  children,
}: {
  icon: FeatherIcon;
  href: string;
  children: string;
}) => (
  <Text display="flex" alignItems="center" gap=".75em" minWidth="0">
    <Icon size="1em" strokeWidth={2.2} />
    <Link color="inherit" href={href} overflowWrap="anywhere">
      {children}
    </Link>
  </Text>
);

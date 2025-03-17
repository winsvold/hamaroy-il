import { urlFor } from "@/sanity/lib/image";
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { Mail, Phone } from "react-feather";
import { Person } from "../../sanity.types";

export const Avatar = (person: Person) => {
  return (
    <Flex gap="1rem">
      {person.image && (
        <Box asChild borderRadius="50%" height="4rem" width="4rem">
          <Image
            height={200}
            width={200}
            src={urlFor(person.image).size(200, 200).url()}
            alt={person.name ?? ""}
          />
        </Box>
      )}

      <Stack gap="0">
        <Heading as="h2" size="md">
          {person.name}
        </Heading>
        <Text fontSize="sm" display="flex" alignItems="center" gap=".5em">
          <Phone size="1em" />
          <Link href={`tel:${person.phone}`}>{person.phone}</Link>
        </Text>
        <Text fontSize="sm" display="flex" alignItems="center" gap=".5em">
          <Mail size="1em" />
          <Link href={`mailto:${person.email}`}>{person.email}</Link>
        </Text>
      </Stack>
    </Flex>
  );
};

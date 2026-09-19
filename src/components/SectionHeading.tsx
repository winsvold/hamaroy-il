import { Heading, HeadingProps } from "@chakra-ui/react";

export const SectionHeading = (props: HeadingProps) => (
  <Heading
    as="h2"
    fontWeight="bold"
    fontSize={{ base: "2xl", md: "3xl" }}
    lineHeight={1}
    marginBottom="1.5rem"
    {...props}
  />
);

import {
  Box,
  BoxProps,
  Heading,
  Link,
  List,
  SystemStyleObject,
  Text,
} from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import { ComponentProps } from "react";
import { SessionSeries } from "../../sanity.types";

const components: ComponentProps<typeof PortableText>["components"] = {
  block: {
    h2: ({ children }) => (
      <Heading marginTop="2em" marginBottom=".5em">
        {children}
      </Heading>
    ),
    normal: ({ children }) => <Text marginBottom="1.5em">{children}</Text>,
  },
  marks: {
    link: ({ value, children }) => (
      <Link
        variant="underline"
        color="deep.base"
        textDecorationColor="deep.base"
        _hover={{ color: "deep.hover" }}
        href={value?.href}
      >
        {children}
      </Link>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <List.Root as="ul" marginBottom="1em">
        {children}
      </List.Root>
    ),
    number: ({ children }) => (
      <List.Root as="ol" marginBottom="1em">
        {children}
      </List.Root>
    ),
  },
  listItem: {
    bullet: ({ children }) => <List.Item>{children}</List.Item>,
    number: ({ children }) => <List.Item>{children}</List.Item>,
  },
};

type Props = {
  blockContent?: SessionSeries["body"] | null;
} & BoxProps;

const css: SystemStyleObject = {
  // Reset margin for the first and last child to remove extra space against the container
  "& > *:first-child": {
    marginTop: "0",
  },
  "& > *:last-child": {
    marginBottom: "0",
  },
};

export const RichText = ({ blockContent, ...chakraProps }: Props) => {
  if (!blockContent) return null;

  return (
    <Box
      lineHeight={1.75}
      color="prose"
      css={css}
      maxWidth="35rem"
      {...chakraProps}
    >
      <PortableText value={blockContent} components={components} />
    </Box>
  );
};

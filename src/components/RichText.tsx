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
    link: ({ value, children }) => {
      const target = !(value?.href || "").startsWith("https://")
        ? "_blank"
        : undefined;
      return (
        <Link
          variant="underline"
          textDecorationColor="blue.400"
          _hover={{ color: "blue.400" }}
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noindex nofollow" : undefined}
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <List.Root as="ol" marginBottom="1em">
        {children}
      </List.Root>
    ),
    number: ({ children }) => (
      <List.Root as="ul" marginBottom="1em">
        {children}
      </List.Root>
    ),
  },
  listItem: {
    bullet: ({ children }) => <List.Item>{children}</List.Item>,
  },
};

type Props = {
  blockContent?: SessionSeries["body"];
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
    <Box fontSize="lg" css={css} {...chakraProps}>
      <PortableText value={blockContent} components={components} />
    </Box>
  );
};

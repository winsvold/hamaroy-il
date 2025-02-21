import { Box, BoxProps, Heading, List, Text } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import { ComponentProps } from "react";
import { SessionSeries } from "../../sanity.types";

const components: ComponentProps<typeof PortableText>["components"] = {
  block: {
    h2: ({ children }) => <Heading>{children}</Heading>,
    normal: ({ children }) => <Text marginBottom="1em">{children}</Text>,
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

export const RichText = ({ blockContent, ...chakraProps }: Props) => {
  if (!blockContent) return null;

  return (
    <Box {...chakraProps}>
      <PortableText value={blockContent} components={components} />
    </Box>
  );
};

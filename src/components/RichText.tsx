import { Box, Heading, List, Text } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import { ComponentProps } from "react";
import { BlockContent } from "../../sanity.types";

type Props = {
  blockContent?: BlockContent;
};

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

export const RichText = (props: Props) => {
  if (!props.blockContent) return null;

  return (
    <Box>
      <PortableText value={props.blockContent} components={components} />
    </Box>
  );
};

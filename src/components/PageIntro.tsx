import { Heading, Stack, Text } from "@chakra-ui/react";
import { Kicker } from "./Kicker";

type Props = {
  kicker?: string;
  title: string;
  text?: string | null;
};

/** Etikett + overskrift + ingress, mønsteret designet bruker øverst på hver oversiktsside. */
export const PageIntro = (props: Props) => (
  <Stack gap=".75rem" maxWidth="38rem">
    {props.kicker && <Kicker>{props.kicker}</Kicker>}
    <Heading
      as="h1"
      fontFamily="heading"
      fontWeight={800}
      fontSize={{ base: "1.875rem", md: "2.375rem" }}
      lineHeight={1.1}
      color="forest.700"
    >
      {props.title}
    </Heading>
    {props.text && (
      <Text fontSize="0.94rem" lineHeight={1.6} color="muted">
        {props.text}
      </Text>
    )}
  </Stack>
);

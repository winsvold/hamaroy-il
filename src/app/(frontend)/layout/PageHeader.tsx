import { Kicker } from "@/components/Kicker";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { PageHero } from "./PageHero";

type Props = {
  kicker?: string;
  title: string;
  text?: string | null;
  variant?: "page" | "detail";
};

export const PageHeader = (props: Props) => (
  <PageHero variant={props.variant ?? "page"}>
    <Stack
      gap="0"
      maxWidth="45rem"
      // Uten ingress havner overskriften ellers oppå fjelltoppene
      paddingBottom={props.text ? undefined : { base: "1.75rem", md: "3rem" }}
    >
      {props.kicker && (
        <Kicker color="aurora.green" marginBottom="1rem">
          {props.kicker}
        </Kicker>
      )}
      <Heading
        as="h1"
        fontFamily="heading"
        fontWeight="extrabold"
        fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
        lineHeight={1}
        letterSpacing="tight"
        color="onDark.base"
        css={{ hyphens: "auto", overflowWrap: "break-word" }}
      >
        {props.title}
      </Heading>
      {props.text && (
        <Text
          fontSize="md"
          lineHeight={1.5}
          color="onDark.soft"
          maxWidth="30rem"
          marginTop="1rem"
        >
          {props.text}
        </Text>
      )}
    </Stack>
  </PageHero>
);

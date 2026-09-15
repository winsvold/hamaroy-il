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
      maxWidth="44rem"
      // Uten ingress havner overskriften ellers oppå fjelltoppene
      paddingBottom={
        props.text ? undefined : { base: "1.75rem", md: "2.75rem" }
      }
    >
      {props.kicker && (
        <Kicker color="aurora.green" marginBottom="1rem">
          {props.kicker}
        </Kicker>
      )}
      <Heading
        as="h1"
        fontFamily="heading"
        fontWeight={800}
        fontSize={{ base: "1.875rem", sm: "2.25rem", md: "3.5rem" }}
        lineHeight={0.98}
        letterSpacing="-.02em"
        color="onDark.base"
        css={{ hyphens: "auto", overflowWrap: "break-word" }}
      >
        {props.title}
      </Heading>
      {props.text && (
        <Text
          fontSize={{ base: "0.9375rem", md: "1rem" }}
          lineHeight={1.6}
          color="onDark.soft"
          maxWidth="30rem"
          marginTop="1.125rem"
        >
          {props.text}
        </Text>
      )}
    </Stack>
  </PageHero>
);

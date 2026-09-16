import { Kicker } from "@/components/Kicker";
import { Heading, HeadingProps, Stack, Text } from "@chakra-ui/react";
import { PageHero } from "./PageHero";

export const HeroTitle = (props: HeadingProps) => (
  <Heading
    as="h1"
    fontWeight="extrabold"
    fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
    lineHeight={1}
    letterSpacing="tight"
    css={{ hyphens: "auto", overflowWrap: "break-word" }}
    {...props}
  />
);

export const HeroText = ({ children }: { children: React.ReactNode }) => (
  <Text lineHeight={1.5} color="onDark.soft" maxWidth="30rem" marginTop="1rem">
    {children}
  </Text>
);

type Props = {
  kicker?: string;
  title: string;
  text?: string | null;
  variant?: "page" | "detail";
  /** Vises under tittelen */
  children?: React.ReactNode;
};

export const PageHeader = ({
  kicker,
  title,
  text,
  variant = "page",
  children,
}: Props) => (
  <PageHero variant={variant}>
    <Stack
      gap="0"
      maxWidth="50rem"
      // Står tittelen alene, havner den ellers oppå fjelltoppene
      paddingBottom={
        text || children ? undefined : { base: "1.75rem", md: "3rem" }
      }
    >
      {kicker && (
        <Kicker color="aurora.green" marginBottom="1rem">
          {kicker}
        </Kicker>
      )}
      <HeroTitle>{title}</HeroTitle>
      {text && <HeroText>{text}</HeroText>}
      {children}
    </Stack>
  </PageHero>
);

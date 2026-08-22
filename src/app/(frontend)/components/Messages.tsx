import { Kicker } from "@/components/Kicker";
import { RichText } from "@/components/RichText";
import { Box, Stack } from "@chakra-ui/react";
import { FrontPageQueryResult } from "../../../../sanity.types";

type Props = {
  messages: FrontPageQueryResult["messages"];
  /** Utgående felt fra siteSettings. Vises bare så lenge det ikke finnes beskjeder. */
  intro: FrontPageQueryResult["intro"];
};

const MessageCard = ({
  label,
  featured,
  children,
}: {
  label?: string | null;
  featured?: boolean;
  children: React.ReactNode;
}) => (
  <Box
    background={featured ? "amber.50" : "forest.50"}
    borderLeft="0.25rem solid"
    borderColor={featured ? "amber.500" : "forest.600"}
    borderRadius="xl"
    padding="1.1rem 1.25rem"
  >
    {label && (
      <Box
        fontSize="0.78rem"
        fontWeight={800}
        letterSpacing=".03em"
        textTransform="uppercase"
        marginBottom=".4rem"
        color={featured ? "amber.700" : "forest.600"}
      >
        {label}
      </Box>
    )}
    <Box
      fontSize="0.875rem"
      fontWeight={600}
      lineHeight={1.55}
      color="forest.700"
      // Beskjeder er korte notiser. Demper avsnitts- og overskriftsluft fra RichText
      // så en flerlinjes beskjed ikke sprenger kortet.
      css={{
        "& p": { marginBottom: "0.75em" },
        "& h2": {
          fontSize: "1.05em",
          marginTop: "0.75em",
          marginBottom: "0.25em",
        },
      }}
    >
      {children}
    </Box>
  </Box>
);

export const Messages = (props: Props) => {
  const hasMessages = !!props.messages?.length;

  if (!hasMessages && !props.intro?.length) return null;

  return (
    <Stack gap="1.25rem" id="beskjeder" as="section">
      <Kicker as="h2">Beskjeder fra klubben</Kicker>
      <Stack gap=".875rem">
        {hasMessages
          ? props.messages.map((message, index) => (
              // Nyeste beskjed får ravfargen, resten skogsgrønn — som i designet
              <MessageCard
                key={message._id}
                label={message.label}
                featured={index === 0}
              >
                <RichText
                  blockContent={message.body}
                  fontSize="inherit"
                  maxWidth="none"
                />
              </MessageCard>
            ))
          : props.intro && (
              <MessageCard featured>
                <RichText
                  blockContent={props.intro ?? undefined}
                  fontSize="inherit"
                  maxWidth="none"
                />
              </MessageCard>
            )}
      </Stack>
    </Stack>
  );
};

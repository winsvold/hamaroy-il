import { Kicker } from "@/components/Kicker";
import { RichText } from "@/components/RichText";
import { SectionHeading } from "@/components/SectionHeading";
import { Box } from "@chakra-ui/react";
import { FrontPageQueryResult } from "../../../../sanity.types";

type Props = {
  messages: FrontPageQueryResult["messages"];
  /** Utgående felt fra siteSettings. Vises bare så lenge det ikke finnes beskjeder. */
  intro: FrontPageQueryResult["intro"];
};

/** Panelet står i en smal kolonne, så lista har et tak framfor å vokse fritt. */
const maxMessages = 3;

const MessageBlock = ({
  label,
  featured,
  isFirst,
  children,
}: {
  label?: string | null;
  featured?: boolean;
  isFirst?: boolean;
  children: React.ReactNode;
}) => (
  <Box
    borderTop={featured ? "2px solid" : "1px solid"}
    borderColor={featured ? "aurora.green" : "hairlineDark"}
    paddingTop=".875rem"
    marginTop={isFirst ? "0" : "1.25rem"}
  >
    {label && (
      <Kicker
        color={featured ? "aurora.green" : "aurora.teal"}
        marginBottom=".5rem"
      >
        {label}
      </Kicker>
    )}
    <Box
      fontSize="0.9375rem"
      lineHeight={1.6}
      color={featured ? "onDark.warm" : "onDark.soft"}
      // Beskjeder er korte notiser. Demper avsnitts- og overskriftsluft fra RichText
      // så en flerlinjes beskjed ikke sprenger panelet.
      css={{
        "& p": { marginBottom: "0.75em" },
        "& p:last-child": { marginBottom: 0 },
        "& h2": {
          fontSize: "1.05em",
          marginTop: "0.75em",
          marginBottom: "0.25em",
        },
        "& a": {
          color: "colors.aurora.green",
          textDecorationColor: "colors.aurora.green",
        },
      }}
    >
      {children}
    </Box>
  </Box>
);

export const Messages = (props: Props) => {
  const messages = props.messages?.slice(0, maxMessages) ?? [];

  if (!messages.length && !props.intro?.length) return null;

  return (
    <Box
      as="section"
      id="beskjeder"
      background="arctic.base"
      padding="1.625rem 1.5rem 1.75rem"
    >
      <SectionHeading color="onDark.base" marginBottom="1.375rem">
        Fra klubben
      </SectionHeading>
      {messages.length ? (
        messages.map((message, index) => (
          // Nyeste beskjed framheves med grønn strek, som i designet
          <MessageBlock
            key={message._id}
            label={message.label}
            featured={index === 0}
            isFirst={index === 0}
          >
            <RichText
              blockContent={message.body}
              fontSize="inherit"
              color="inherit"
              maxWidth="none"
            />
          </MessageBlock>
        ))
      ) : (
        <MessageBlock featured isFirst>
          <RichText
            blockContent={props.intro ?? undefined}
            fontSize="inherit"
            color="inherit"
            maxWidth="none"
          />
        </MessageBlock>
      )}
    </Box>
  );
};

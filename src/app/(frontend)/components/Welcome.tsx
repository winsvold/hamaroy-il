import { DefaultContainer } from "@/components/DefaultContainer";
import { Kicker } from "@/components/Kicker";
import { RichText } from "@/components/RichText";
import { Box, Stack } from "@chakra-ui/react";
import { FrontPageQueryResult } from "../../../../sanity.types";

type Props = {
  intro: FrontPageQueryResult["intro"];
  messages: FrontPageQueryResult["messages"];
};

/** Beskjeder er korte notiser. Taket hindrer at de skyver velkomsten ut av feltet. */
const maxMessages = 3;

/**
 * Det hvite feltet rett under hero-en, med klubbens egen velkomsttekst
 * (`siteSettings.intro`).
 *
 * Designet fjerner «Fra klubben»-beskjedene i den tro at datamodellen ikke har noen
 * slik samling. Det har den, og den er i bruk. Aktive beskjeder står derfor under
 * velkomsten i samme felt, framfor å forsvinne fra nettsiden.
 */
export const Welcome = ({ intro, messages }: Props) => {
  const activeMessages = messages.slice(0, maxMessages);
  const hasIntro = !!intro?.length;

  if (!hasIntro && !activeMessages.length) return null;

  return (
    <DefaultContainer paddingTop="3.25rem">
      <Box
        as="section"
        background="card.base"
        padding={{ base: "1.5rem 1.25rem", md: "2.25rem 2.5rem 2.375rem" }}
        css={{
          // Overskriften redaktøren setter øverst i teksten er feltets tittel
          "& h2": {
            columnSpan: "all",
            maxWidth: "48.75rem",
            fontSize: { base: "1.5rem", md: "1.875rem" },
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: "-.01em",
            color: "ink",
            marginBottom: "1.375rem",
          },
          "& p": { breakInside: "avoid" },
        }}
      >
        {/*
          Spalter framfor designets 2×2-rutenett: det forutsatte fire omtrent like lange
          avsnitt, mens den faktiske teksten har seks av svært ulik lengde. Spaltene
          balanserer dem uansett hvor mange redaktøren skriver.
        */}
        <RichText
          blockContent={intro}
          maxWidth="none"
          fontSize="0.9375rem"
          lineHeight={1.65}
          columnCount={{ base: 1, md: 2 }}
          columnGap="2.75rem"
        />
        {!!activeMessages.length && (
          <Stack
            gap="1.25rem"
            marginTop={hasIntro ? "1.75rem" : undefined}
            paddingTop={hasIntro ? "1.5rem" : undefined}
            borderTop={hasIntro ? "1px solid" : undefined}
            borderColor="hairline"
          >
            {activeMessages.map((message) => (
              <Box key={message._id} maxWidth="40rem">
                <Kicker marginBottom=".5rem">{message.label}</Kicker>
                <RichText
                  blockContent={message.body}
                  maxWidth="none"
                  fontSize="0.9375rem"
                  lineHeight={1.65}
                />
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </DefaultContainer>
  );
};

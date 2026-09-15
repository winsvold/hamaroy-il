import { DefaultContainer } from "@/components/DefaultContainer";
import { RichText } from "@/components/RichText";
import { Box } from "@chakra-ui/react";
import { FrontPageQueryResult } from "../../../../sanity.types";

type Props = {
  intro: FrontPageQueryResult["intro"];
};

/**
 * Det hvite feltet rett under hero-en, med klubbens egen velkomsttekst
 * (`siteSettings.intro`). Ett redigerbart tekstfelt, ikke en strøm av beskjeder.
 */
export const Welcome = ({ intro }: Props) => {
  if (!intro?.length) return null;

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
      </Box>
    </DefaultContainer>
  );
};

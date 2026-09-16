import { DefaultContainer } from "@/components/DefaultContainer";
import { RichText } from "@/components/RichText";
import { Box } from "@chakra-ui/react";
import { FrontPageQueryResult } from "../../../../sanity.types";

type Props = {
  intro: FrontPageQueryResult["intro"];
};

export const Welcome = ({ intro }: Props) => {
  if (!intro?.length) return null;

  return (
    <DefaultContainer paddingTop="3rem">
      <Box
        as="section"
        background="card.base"
        padding={{ base: "1.5rem 1.25rem", md: "2rem 2.5rem 2.5rem" }}
        css={{
          // Første overskrift i teksten er feltets tittel
          "& h2": {
            columnSpan: "all",
            maxWidth: "50rem",
            fontSize: { base: "2xl", md: "3xl" },
            fontWeight: "bold",
            lineHeight: 1,
            color: "ink",
            marginBottom: "1.5rem",
          },
          "& p": { breakInside: "avoid" },
        }}
      >
        <RichText
          blockContent={intro}
          maxWidth="none"
          fontSize="md"
          lineHeight={1.75}
          columnCount={{ base: 1, md: 2 }}
          columnGap="3rem"
        />
      </Box>
    </DefaultContainer>
  );
};

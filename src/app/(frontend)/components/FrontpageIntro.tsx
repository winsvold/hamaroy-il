import { RichText } from "@/components/RichText";
import { Box } from "@chakra-ui/react";
import { FrontPageQueryResult } from "../../../../sanity.types";

type Props = {
  intro?: NonNullable<FrontPageQueryResult["settings"]>["intro"];
};

export const FrontpageIntro = ({ intro }: Props) => {
  if (!intro?.length) return null;

  return (
    <Box
      as="section"
      background="card.base"
      padding={{ base: "1.5rem", md: "2.5rem" }}
      css={{
        // Bare den første overskriften i teksten er feltets tittel
        "& h2:first-of-type": {
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
        columnCount={{ base: 1, md: 2 }}
        columnGap="6rem"
      />
    </Box>
  );
};

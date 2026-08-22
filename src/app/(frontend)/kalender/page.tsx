import { DefaultContainer } from "@/components/DefaultContainer";
import { PageIntro } from "@/components/PageIntro";
import { Stack } from "@chakra-ui/react";
import { Calendar } from "../components/calendar";

const Page = async () => {
  return (
    <DefaultContainer paddingTop={{ base: "2rem", md: "3.5rem" }}>
      <Stack gap="2.5rem">
        <PageIntro
          kicker="Kalender"
          title="Alt som skjer framover"
          text="Treninger og arrangementer i hele idrettslaget, sortert etter dato."
        />
        <Calendar />
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

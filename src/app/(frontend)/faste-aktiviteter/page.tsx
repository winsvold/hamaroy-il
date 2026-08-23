import { DefaultContainer } from "@/components/DefaultContainer";
import { PageIntro } from "@/components/PageIntro";
import { Stack } from "@chakra-ui/react";
import { RecurringEvents } from "../components/RecurringEvents";

/**
 * Samme liste står også på forsiden. Siden beholdes fordi den gir en adresse å
 * lenke direkte til — fra menyen, bunnteksten, tomme tilstander og brødsmulene.
 */
const Page = () => (
  <DefaultContainer paddingTop={{ base: "2rem", md: "3.5rem" }}>
    <Stack gap="2.5rem">
      <PageIntro
        kicker="Faste aktiviteter"
        title="Alle faste treningstilbud i Hamarøy IL"
        text="Oversikt over faste grupper og aldersinndelte tilbud på tvers av klubbene. Trykk på en aktivitet for treningstider og sted."
      />
      <RecurringEvents />
    </Stack>
  </DefaultContainer>
);

export default Page;

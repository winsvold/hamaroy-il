import { DefaultContainer } from "@/components/DefaultContainer";
import { Calendar } from "../components/calendar";
import { PageHeader } from "../layout/PageHeader";

const Page = async () => {
  return (
    <>
      <PageHeader
        kicker="Kalender"
        title="Alt som skjer framover"
        text="Treninger og arrangementer i hele idrettslaget, sortert etter dato."
      />
      <DefaultContainer paddingTop="4rem" paddingBottom="5rem">
        <Calendar />
      </DefaultContainer>
    </>
  );
};

export default Page;

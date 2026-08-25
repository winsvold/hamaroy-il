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
      <DefaultContainer paddingTop="3.75rem" paddingBottom="4.75rem">
        <Calendar />
      </DefaultContainer>
    </>
  );
};

export default Page;

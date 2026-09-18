import { Calendar } from "../components/calendar";
import { PageContent } from "../layout/PageContent";
import { PageHeader } from "../layout/PageHeader";

const Page = () => (
  <>
    <PageHeader
      kicker="Kalender"
      title="Alt som skjer framover"
      text="Treninger og arrangementer i hele idrettslaget, sortert etter dato."
    />
    <PageContent>
      <Calendar />
    </PageContent>
  </>
);

export default Page;

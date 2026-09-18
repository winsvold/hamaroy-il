import { RecurringEvents } from "../components/RecurringEvents";
import { PageContent } from "../layout/PageContent";
import { PageHeader } from "../layout/PageHeader";

const Page = () => (
  <>
    <PageHeader kicker="Hele året, alle aldre" title="Faste aktiviteter" />
    <PageContent>
      <RecurringEvents />
    </PageContent>
  </>
);

export default Page;

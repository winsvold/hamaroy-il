import { DefaultContainer } from "@/components/DefaultContainer";
import { RecurringEvents } from "../components/RecurringEvents";
import { PageHeader } from "../layout/PageHeader";

const Page = () => (
  <>
    <PageHeader kicker="Hele året, alle aldre" title="Faste aktiviteter" />
    <DefaultContainer paddingTop="3.75rem" paddingBottom="4.75rem">
      <RecurringEvents />
    </DefaultContainer>
  </>
);

export default Page;

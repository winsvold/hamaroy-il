import { DefaultContainer } from "@/components/DefaultContainer";
import { Stack } from "@chakra-ui/react";
import { Activities } from "../components/activities";

const Page = async () => {
  return (
    <DefaultContainer>
      <Stack>
        <Activities />
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

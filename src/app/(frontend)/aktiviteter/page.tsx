import { DefaultContainer } from "@/components/DefaultContainer";
import { Stack } from "@chakra-ui/react";
import { Sessions } from "../components/sessions";

const Page = async () => {
  return (
    <DefaultContainer>
      <Stack>
        <Sessions />
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

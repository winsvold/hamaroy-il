import { DefaultContainer } from "@/components/DefaultContainer";
import { Stack } from "@chakra-ui/react";
import { Calendar } from "../components/calendar";

const Page = async () => {
  return (
    <DefaultContainer>
      <Stack>
        <Calendar />
      </Stack>
    </DefaultContainer>
  );
};

export default Page;

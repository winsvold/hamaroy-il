import { DefaultContainer } from "@/components/DefaultContainer";
import { Link, Box, Flex } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Box padding="1rem">
      <DefaultContainer as="footer">
        <Flex justifyContent="flex-end">
          <Link href="/cms">Admin</Link>
        </Flex>
      </DefaultContainer>
    </Box>
  );
};

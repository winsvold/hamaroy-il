import { DefaultContainer } from "@/components/DefaultContainer";
import { Link, Box, Flex } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Box paddingY="1.5rem">
      <DefaultContainer as="footer">
        <Flex justifyContent="flex-end">
          <Link href="/cms">Admin</Link>
        </Flex>
      </DefaultContainer>
    </Box>
  );
};

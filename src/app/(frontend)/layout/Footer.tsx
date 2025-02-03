import { DefaultContainer } from "@/components/DefaultContainer";
import { Link, Box } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Box padding="1rem">
      <DefaultContainer as="footer">
        <Link href="/cms">Admin</Link>
      </DefaultContainer>
    </Box>
  );
};

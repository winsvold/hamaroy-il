import { Box, BoxProps } from "@chakra-ui/react";
import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
} & BoxProps;

export const CallToAction = ({ href, children, ...props }: Props) => (
  <Box
    asChild
    display="inline-flex"
    flexShrink={0}
    padding="1rem 1.5rem"
    background="aurora.green"
    color="onAurora"
    fontSize="xs"
    fontWeight="bold"
    letterSpacing=".15em"
    textTransform="uppercase"
    whiteSpace="nowrap"
    transition="background .2s, color .2s"
    _hover={{ background: "arctic.base", color: "aurora.green" }}
    {...props}
  >
    <Link href={href}>{children}</Link>
  </Box>
);

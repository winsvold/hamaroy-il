import { Box, BoxProps } from "@chakra-ui/react";
import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
} & BoxProps;

/**
 * Den ene knappen designet bruker: grønn, versal og bare så bred som teksten. En mørk
 * stripe over hele bredden ble prøvd og forsvant i rytmen mellom seksjonene.
 */
export const CallToAction = ({ href, children, ...chakraProps }: Props) => (
  <Box
    asChild
    display="inline-flex"
    alignItems="center"
    gap=".625rem"
    padding=".9375rem 1.625rem"
    background="aurora.green"
    color="onAurora"
    fontSize="0.75rem"
    fontWeight={700}
    letterSpacing=".14em"
    textTransform="uppercase"
    transition="background .2s, color .2s"
    _hover={{ background: "arctic.base", color: "aurora.green" }}
    {...chakraProps}
  >
    <Link href={href}>{children}</Link>
  </Box>
);

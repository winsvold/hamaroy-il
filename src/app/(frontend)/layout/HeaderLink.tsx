"use client";

import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { href: string; children: React.ReactNode };

export const HeaderLink = (props: Props) => {
  const pathName = usePathname();

  const isSelected = pathName.includes(props.href);

  return (
    <Box
      asChild
      textDecoration={isSelected ? "underline" : "none"}
      fontWeight={isSelected ? "600" : "normal"}
    >
      <Link href={props.href}>{props.children}</Link>
    </Box>
  );
};

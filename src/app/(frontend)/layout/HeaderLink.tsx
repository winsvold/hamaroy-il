"use client";

import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { href: string; children: React.ReactNode };

/** Sant for href-en selv og alt som ligger under den, men ikke for «/info/om-oss-2» */
const isCurrent = (pathName: string, href: string) =>
  pathName === href || pathName.startsWith(`${href}/`);

export const HeaderLink = (props: Props) => {
  const pathName = usePathname();
  const isSelected = isCurrent(pathName, props.href);

  return (
    <Box
      asChild
      fontWeight={600}
      fontSize={{ base: "1rem", lg: "0.875rem" }}
      whiteSpace="nowrap"
      color={isSelected ? "amber.700" : "forest.700"}
      opacity={isSelected ? 1 : 0.85}
      transition="color .2s, opacity .2s"
      _hover={{ color: "amber.700", opacity: 1 }}
    >
      <Link href={props.href} aria-current={isSelected ? "page" : undefined}>
        {props.children}
      </Link>
    </Box>
  );
};

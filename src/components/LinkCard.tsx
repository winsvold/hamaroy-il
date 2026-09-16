import {
  Heading,
  HeadingProps,
  LinkBox,
  LinkBoxProps,
  LinkOverlay,
} from "@chakra-ui/react";
import Link from "next/link";

/** Hvitt kort som lenker videre. Lenka legges på tittelen med `LinkCardTitle`. */
export const LinkCard = (props: LinkBoxProps) => (
  <LinkBox
    className="group"
    background="card.base"
    transition="background .2s"
    _hover={{ background: "card.hover" }}
    {...props}
  />
);

export const LinkCardTitle = ({
  href,
  children,
  ...props
}: HeadingProps & { href: string }) => (
  <Heading
    as="h3"
    fontFamily="body"
    fontWeight="bold"
    lineHeight={1.25}
    transition="color .2s"
    _groupHover={{ color: "deep.base" }}
    {...props}
  >
    <LinkOverlay asChild>
      <Link href={href}>{children}</Link>
    </LinkOverlay>
  </Heading>
);

import { CallToAction } from "@/components/CallToAction";
import { DefaultContainer } from "@/components/DefaultContainer";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { HeaderLink } from "./HeaderLink";
import { MobileMenu } from "./MobileMenu";
import { fixedLinks, infoPageLinks } from "./navigation";

const headerQuery = defineQuery(`{
  "siteSettings": *[_type == "siteSettings"][0]{ logo },
  "infoPages": *[_type == "infoPage"] | order(order asc, title asc) {
    title,
    slug,
    menuPlacement,
  },
  "clubs": *[_type == "club"] | order(name asc) { name, slug }
}`);

export const Header = async () => {
  const { siteSettings, infoPages, clubs } = await sanityFetch(headerQuery);

  const logo = (
    <Logo
      url={siteSettings?.logo && urlFor(siteSettings.logo).size(100, 100).url()}
    />
  );
  const links = [
    ...fixedLinks,
    ...infoPageLinks(infoPages, "hovedmeny"),
    ...clubs.map((club) => ({
      href: `/klubber/${club.slug?.current}`,
      label: club.name ?? "",
    })),
    ...infoPageLinks(infoPages, "sekundaermeny"),
  ].map((link) => (
    <HeaderLink key={link.href} href={link.href}>
      {link.label}
    </HeaderLink>
  ));
  const [topButton] = infoPageLinks(infoPages, "toppknapp");

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex={10}
      background="arctic.base"
      color="onDark.base"
      paddingY="1.25rem"
    >
      <DefaultContainer>
        <Flex align="center" gap={{ base: ".75rem", lg: "2.5rem" }}>
          {logo}
          <Flex
            as="nav"
            hideBelow="lg"
            align="center"
            gap="1.5rem"
            flexWrap="wrap"
          >
            {links}
          </Flex>
          <Flex marginLeft="auto" align="center" gap=".5rem" flexShrink={0}>
            {topButton && (
              <CallToAction
                href={topButton.href}
                fontSize="2xs"
                padding=".5rem 1rem"
                _hover={{ background: "aurora.teal" }}
              >
                {topButton.label}
              </CallToAction>
            )}
            <MobileMenu logo={logo}>
              <Stack gap="1.25rem">{links}</Stack>
            </MobileMenu>
          </Flex>
        </Flex>
      </DefaultContainer>
    </Box>
  );
};

const Logo = ({ url }: { url?: string | null }) => (
  <Flex asChild align="center" flexShrink={0}>
    <Link href="/">
      {url ? (
        <>
          <Box asChild boxSize="2rem" objectFit="contain">
            <Image alt="" src={url} width={100} height={100} />
          </Box>
          <Box srOnly>Hamarøy IL</Box>
        </>
      ) : (
        <Box
          fontFamily="heading"
          fontWeight="extrabold"
          fontSize="lg"
          whiteSpace="nowrap"
        >
          Hamarøy IL
        </Box>
      )}
    </Link>
  </Flex>
);

import { CallToAction } from "@/components/CallToAction";
import { DefaultContainer } from "@/components/DefaultContainer";
import { urlFor } from "@/sanity/lib/image";
import { Box, Flex, Stack } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { HeaderLink } from "./HeaderLink";
import { getLayoutData } from "./layoutData";
import { MobileMenu } from "./MobileMenu";
import { fixedLinks, menuLinks } from "./navigation";

export const Header = async () => {
  const { siteSettings, infoPages, clubs } = await getLayoutData();

  const logo = (
    <Logo
      // Bare bredde, ellers beskjærer Sanity logoen til en firkant
      url={
        siteSettings?.logo?.asset && urlFor(siteSettings.logo).width(100).url()
      }
    />
  );
  const links = [
    ...fixedLinks,
    ...menuLinks(infoPages, "meny"),
    ...clubs.map((club) => ({
      href: `/klubber/${club.slug?.current}`,
      label: club.name ?? "",
    })),
  ].map((link) => (
    <HeaderLink key={link.href} href={link.href}>
      {link.label}
    </HeaderLink>
  ));
  const [topButton] = menuLinks(infoPages, "toppknapp");

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

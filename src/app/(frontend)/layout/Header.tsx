import { DefaultContainer } from "@/components/DefaultContainer";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { HeaderLink } from "./HeaderLink";
import { MobileMenu } from "./MobileMenu";

const headerQuery = defineQuery(`{
  "siteSettings": *[_type == "siteSettings"][0]{ logo },
  "infoPages": *[_type == "infoPage"] | order(order asc, title asc) {
    title,
    slug,
    menuPlacement,
  },
  "clubs": *[_type == "club"] | order(name asc) { name, slug }
}`);

type NavLink = { href: string; label: string };

export const Header = async () => {
  const data = await sanityFetch(headerQuery);
  const logoUrl =
    data?.siteSettings?.logo &&
    urlFor(data?.siteSettings?.logo).size(100, 100).url();

  const infoPagesIn = (placement: string): NavLink[] =>
    data.infoPages
      .filter((page) =>
        page.menuPlacement?.length
          ? page.menuPlacement.includes(placement)
          : // Sider uten plassering havner i sekundærmenyen
            placement === "sekundaermeny",
      )
      .map((page) => ({
        href: `/info/${page.slug?.current}`,
        label: page.title ?? "",
      }));

  const links: NavLink[] = [
    { href: "/kalender", label: "Kalender" },
    { href: "/faste-aktiviteter", label: "Faste aktiviteter" },
    { href: "/lokaler", label: "Lokaler" },
    ...infoPagesIn("hovedmeny"),
    ...data.clubs.map((club) => ({
      href: `/klubber/${club.slug?.current}`,
      label: club.name ?? "",
    })),
    ...infoPagesIn("sekundaermeny"),
  ];

  const callToAction = infoPagesIn("toppknapp")[0];

  const logo = (
    <Flex align="center" gap=".5rem" asChild flexShrink={0}>
      <Link href="/">
        {logoUrl ? (
          <>
            <Box asChild width="2rem" height="2rem" objectFit="contain">
              <Image alt="" src={logoUrl} width={100} height={100} />
            </Box>
            <Box srOnly>Hamarøy IL</Box>
          </>
        ) : (
          <Box
            fontFamily="heading"
            fontWeight="extrabold"
            fontSize="lg"
            color="onDark.base"
            whiteSpace="nowrap"
          >
            Hamarøy IL
          </Box>
        )}
      </Link>
    </Flex>
  );

  const ctaButton = callToAction && (
    <Box
      asChild
      textStyle="kicker"
      flexShrink={0}
      background="aurora.green"
      color="onAurora"
      borderRadius="none"
      padding=".5rem 1rem"
      whiteSpace="nowrap"
      transition="background .2s"
      _hover={{ background: "aurora.teal" }}
    >
      <Link href={callToAction.href}>{callToAction.label}</Link>
    </Box>
  );

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex={10}
      background="arctic.base"
      paddingY="1.25rem"
    >
      <DefaultContainer>
        <Flex align="center" gap={{ base: ".75rem", lg: "2.5rem" }}>
          {logo}

          <Flex
            as="nav"
            display={{ base: "none", lg: "flex" }}
            align="center"
            gap="1.5rem"
            marginRight="auto"
            flexWrap="wrap"
          >
            {links.map((link) => (
              <HeaderLink key={link.href} href={link.href}>
                {link.label}
              </HeaderLink>
            ))}
          </Flex>

          <Flex marginLeft="auto" align="center" gap=".5rem" flexShrink={0}>
            {ctaButton}
            <Box display={{ base: "block", lg: "none" }}>
              <MobileMenu logo={logo}>
                <Stack gap="1.25rem">
                  {links.map((link) => (
                    <HeaderLink key={link.href} href={link.href}>
                      {link.label}
                    </HeaderLink>
                  ))}
                </Stack>
              </MobileMenu>
            </Box>
          </Flex>
        </Flex>
      </DefaultContainer>
    </Box>
  );
};

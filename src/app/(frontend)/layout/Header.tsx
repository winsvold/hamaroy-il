import { DefaultContainer } from "@/components/DefaultContainer";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Box, Button, Flex, HStack, Stack } from "@chakra-ui/react";
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
          : // Sider fra før `menuPlacement` fantes har ingen plassering. De havner i
            // sekundærmenyen, slik de lå før — ellers ville de forsvinne ut av menyen
            // helt til noen rekker å redigere hver enkelt side.
            placement === "sekundaermeny",
      )
      .map((page) => ({
        href: `/info/${page.slug?.current}`,
        label: page.title ?? "",
      }));

  // Faste lenker først, så infosider redaktøren har plassert i hovedmenyen
  const primaryLinks: NavLink[] = [
    { href: "/kalender", label: "Kalender" },
    { href: "/faste-aktiviteter", label: "Faste aktiviteter" },
    { href: "/lokaler", label: "Lokaler" },
    ...infoPagesIn("hovedmeny"),
  ];

  // Klubbene listes direkte så lenge det er en håndfull av dem. Blir det flere
  // enn ~3 bør de få en egen /klubber-oversikt i stedet.
  const secondaryLinks: NavLink[] = [
    ...data.clubs.map((club) => ({
      href: `/klubber/${club.slug?.current}`,
      label: club.name ?? "",
    })),
    ...infoPagesIn("sekundaermeny"),
  ];

  const callToAction = infoPagesIn("toppknapp")[0];

  const logo = (
    <HStack gap=".6rem" asChild flexShrink={0}>
      <Link href="/">
        {logoUrl && (
          <Box asChild width="2.125rem" height="2.125rem" objectFit="contain">
            <Image alt="" src={logoUrl} width={100} height={100} />
          </Box>
        )}
        {/* Bevisst ikke en <h1> — hver side har sin egen overskrift */}
        <Box
          fontFamily="heading"
          fontWeight={800}
          fontSize={{ base: "1.05rem", md: "1.3rem" }}
          letterSpacing=".01em"
          textTransform="uppercase"
          whiteSpace="nowrap"
        >
          Hamarøy IL
        </Box>
      </Link>
    </HStack>
  );

  const ctaButton = callToAction && (
    <Button
      asChild
      flexShrink={0}
      background="forest.700"
      color="onDark"
      _hover={{ background: "forest.800" }}
      borderRadius="md"
      fontWeight={700}
      fontSize={{ base: "0.75rem", md: "0.85rem" }}
      paddingX={{ base: ".8rem", md: "1.25rem" }}
      size={{ base: "sm", md: "md" }}
    >
      <Link href={callToAction.href}>{callToAction.label}</Link>
    </Button>
  );

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex={10}
      background="surface"
      borderBottom="1px solid"
      borderColor="hairline"
      paddingY=".85rem"
    >
      <DefaultContainer>
        <Flex align="center" gap={{ base: ".75rem", lg: "2.25rem" }}>
          {logo}

          <Flex
            as="nav"
            display={{ base: "none", lg: "flex" }}
            align="center"
            gap="1.6rem"
            marginRight="auto"
            flexWrap="wrap"
          >
            {primaryLinks.map((link) => (
              <HeaderLink key={link.href} href={link.href}>
                {link.label}
              </HeaderLink>
            ))}
            {!!secondaryLinks.length && (
              <Box width="1px" height=".9rem" background="hairlineStrong" />
            )}
            {secondaryLinks.map((link) => (
              <HeaderLink key={link.href} href={link.href}>
                {link.label}
              </HeaderLink>
            ))}
          </Flex>

          <Flex marginLeft="auto" align="center" gap=".5rem" flexShrink={0}>
            {ctaButton}
            <Box display={{ base: "block", lg: "none" }}>
              <MobileMenu logo={logo}>
                <Stack gap="1.25rem" fontSize="1.1rem">
                  {primaryLinks.map((link) => (
                    <HeaderLink key={link.href} href={link.href}>
                      {link.label}
                    </HeaderLink>
                  ))}
                  {!!secondaryLinks.length && (
                    <Box height="1px" background="hairline" />
                  )}
                  {secondaryLinks.map((link) => (
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

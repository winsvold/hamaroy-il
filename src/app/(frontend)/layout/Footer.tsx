import { DefaultContainer } from "@/components/DefaultContainer";
import { Kicker } from "@/components/Kicker";
import { sanityFetch } from "@/sanity/lib/client";
import { Box, Flex, Grid, Stack } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Link from "next/link";

const footerQuery = defineQuery(`{
  "siteSettings": *[_type == "siteSettings"][0]{ footerText, contactEmail },
  "infoPages": *[_type == "infoPage"] | order(order asc, title asc) {
    title,
    slug,
    menuPlacement,
  }
}`);

const FootLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Box
    asChild
    fontSize="0.875rem"
    fontWeight={600}
    color="onDark.secondary"
    transition="color .2s"
    _hover={{ color: "aurora.green" }}
  >
    <Link href={href}>{children}</Link>
  </Box>
);

export const Footer = async () => {
  const data = await sanityFetch(footerQuery);

  const infoPagesIn = (placement: string) =>
    data.infoPages
      .filter((page) => page.menuPlacement?.includes(placement))
      .map((page) => ({
        href: `/info/${page.slug?.current}`,
        label: page.title ?? "",
      }));

  const shortcuts = [
    { href: "/kalender", label: "Kalender" },
    { href: "/faste-aktiviteter", label: "Faste aktiviteter" },
    { href: "/lokaler", label: "Lokaler" },
    ...infoPagesIn("bunn-snarveier"),
  ];
  const contactLinks = infoPagesIn("bunn-kontakt");
  const email = data.siteSettings?.contactEmail;

  return (
    <Box
      as="footer"
      background="arctic.base"
      color="onDark.base"
      paddingTop="2.75rem"
    >
      <DefaultContainer>
        <Grid
          gridTemplateColumns={{
            base: "1fr",
            sm: "1fr 1fr",
            md: "1.6fr 1fr 1fr",
          }}
          gap="3rem"
          paddingBottom="1.625rem"
          borderBottom="1px solid"
          borderColor="hairlineDarkFaint"
        >
          <Box>
            <Box
              fontFamily="heading"
              fontWeight={800}
              fontSize="1.25rem"
              letterSpacing="-.01em"
              marginBottom=".625rem"
            >
              Hamarøy IL
            </Box>
            {data.siteSettings?.footerText && (
              <Box
                fontSize="0.9375rem"
                lineHeight={1.6}
                color="onDark.tertiary"
                maxWidth="18.75rem"
              >
                {data.siteSettings.footerText}
              </Box>
            )}
          </Box>

          <Box>
            <Kicker color="aurora.green" marginBottom=".875rem">
              Snarveier
            </Kicker>
            <Stack gap=".625rem" alignItems="flex-start">
              {shortcuts.map((link) => (
                <FootLink key={link.href} href={link.href}>
                  {link.label}
                </FootLink>
              ))}
            </Stack>
          </Box>

          {(!!contactLinks.length || email) && (
            <Box>
              <Kicker color="aurora.green" marginBottom=".875rem">
                Kontakt
              </Kicker>
              <Stack gap=".625rem" alignItems="flex-start">
                {contactLinks.map((link) => (
                  <FootLink key={link.href} href={link.href}>
                    {link.label}
                  </FootLink>
                ))}
                {email && <FootLink href={`mailto:${email}`}>{email}</FootLink>}
              </Stack>
            </Box>
          )}
        </Grid>

        <Flex
          paddingTop="1.125rem"
          paddingBottom="1.375rem"
          justify="space-between"
          align="center"
          gap="1rem"
          fontSize="0.78125rem"
          fontWeight={500}
          color="onDark.faint"
        >
          <Box>© {new Date().getFullYear()} Hamarøy IL</Box>
          <Box asChild _hover={{ textDecoration: "underline" }}>
            <Link href="/cms">Admin</Link>
          </Box>
        </Flex>
      </DefaultContainer>
    </Box>
  );
};

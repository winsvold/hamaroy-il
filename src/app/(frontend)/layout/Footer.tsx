import { DefaultContainer } from "@/components/DefaultContainer";
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

const FootHeading = ({ children }: { children: React.ReactNode }) => (
  <Box
    textStyle="kicker"
    color="forest.400"
    fontSize="0.7rem"
    marginBottom=".75rem"
  >
    {children}
  </Box>
);

const FootLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Box
    asChild
    fontSize="0.85rem"
    fontWeight={600}
    color="forest.200"
    opacity={0.85}
    transition="opacity .2s"
    _hover={{ opacity: 1, textDecoration: "underline" }}
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
    <Box as="footer" background="forest.700" color="onDark" paddingTop="3.5rem">
      <DefaultContainer>
        <Grid
          gridTemplateColumns={{
            base: "1fr",
            sm: "1fr 1fr",
            md: "1.4fr 1fr 1fr",
          }}
          gap="2.5rem"
          paddingBottom="2.25rem"
          borderBottom="1px solid"
          borderColor="rgba(242, 237, 226, 0.15)"
        >
          <Box>
            <Box
              fontFamily="heading"
              fontWeight={800}
              fontSize="1.25rem"
              marginBottom=".6rem"
            >
              Hamarøy IL
            </Box>
            {data.siteSettings?.footerText && (
              <Box
                fontSize="0.85rem"
                lineHeight={1.6}
                color="forest.200"
                maxWidth="20rem"
              >
                {data.siteSettings.footerText}
              </Box>
            )}
          </Box>

          <Box>
            <FootHeading>Snarveier</FootHeading>
            <Stack gap=".55rem" alignItems="flex-start">
              {shortcuts.map((link) => (
                <FootLink key={link.href} href={link.href}>
                  {link.label}
                </FootLink>
              ))}
            </Stack>
          </Box>

          {(!!contactLinks.length || email) && (
            <Box>
              <FootHeading>Kontakt</FootHeading>
              <Stack gap=".55rem" alignItems="flex-start">
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
          paddingY="1.35rem"
          justify="space-between"
          align="center"
          gap="1rem"
          fontSize="0.75rem"
          fontWeight={500}
          color="forest.400"
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

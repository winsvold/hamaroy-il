import { DefaultContainer } from "@/components/DefaultContainer";
import { Kicker } from "@/components/Kicker";
import { Box, Flex, Grid, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { sift } from "radash";
import { getLayoutData } from "./layoutData";
import { fixedLinks, infoPageLinks, NavLink } from "./navigation";

export const Footer = async () => {
  const { siteSettings, infoPages } = await getLayoutData();
  const email = siteSettings?.contactEmail;
  const contactLinks = sift([
    ...infoPageLinks(infoPages, "bunn-kontakt"),
    email && { href: `mailto:${email}`, label: email },
  ]);

  return (
    <Box
      as="footer"
      background="arctic.base"
      color="onDark.base"
      paddingTop="3rem"
    >
      <DefaultContainer>
        <Grid
          gridTemplateColumns={{
            base: "1fr",
            sm: "1fr 1fr",
            md: "3fr 2fr 2fr",
          }}
          gap="3rem"
          paddingBottom="1.5rem"
          borderBottom="1px solid"
          borderColor="onDark.secondary/20"
        >
          <Box>
            <Box
              fontFamily="heading"
              fontWeight="extrabold"
              fontSize="xl"
              marginBottom=".5rem"
            >
              Hamarøy IL
            </Box>
            {siteSettings?.footerText && (
              <Text lineHeight={1.5} color="onDark.tertiary" maxWidth="20rem">
                {siteSettings.footerText}
              </Text>
            )}
          </Box>
          <FooterColumn
            title="Snarveier"
            links={[
              ...fixedLinks,
              ...infoPageLinks(infoPages, "bunn-snarveier"),
            ]}
          />
          {!!contactLinks.length && (
            <FooterColumn title="Kontakt" links={contactLinks} />
          )}
        </Grid>

        <Flex
          paddingTop="1rem"
          paddingBottom="1.5rem"
          justify="space-between"
          gap="1rem"
          fontSize="xs"
          fontWeight="medium"
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

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: NavLink[];
}) => (
  <Box>
    <Kicker color="aurora.green" marginBottom="1rem">
      {title}
    </Kicker>
    <Stack gap=".5rem" alignItems="flex-start">
      {links.map((link) => (
        <Box
          key={link.href}
          asChild
          fontSize="sm"
          fontWeight="semibold"
          color="onDark.secondary"
          transition="color .2s"
          _hover={{ color: "aurora.green" }}
        >
          <Link href={link.href}>{link.label}</Link>
        </Box>
      ))}
    </Stack>
  </Box>
);

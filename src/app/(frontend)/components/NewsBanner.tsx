import { sanityFetch } from "@/sanity/lib/client";
import { Box, Flex } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Link from "next/link";

const bannerQuery = defineQuery(`*[
  _type == "message" &&
  showInBanner == true &&
  defined(bannerText) &&
  (!defined(expiresAt) || expiresAt > now())
] | order(publishedAt desc)[0] {
  label,
  bannerText,
}`);

/**
 * «Siste nytt»-stripa. Vises på alle sider, ikke bare forsiden — en kunngjøring er like
 * relevant for noen som lander rett på /faste-aktiviteter.
 *
 * Teksten her er med vilje en kort variant (`bannerText`); hele beskjeden står under
 * «Beskjeder fra klubben» på forsiden, så stripa gjentar ikke et helt avsnitt.
 */
export const NewsBanner = async () => {
  const message = await sanityFetch(bannerQuery);

  if (!message?.bannerText) return null;

  return (
    <Box
      background="amber.500"
      color="forest.700"
      paddingY=".7rem"
      paddingX="1.25rem"
    >
      <Flex
        justify="center"
        align="center"
        gap=".65rem"
        flexWrap="wrap"
        textAlign="center"
      >
        {message.label && (
          <Box
            flexShrink={0}
            background="rgba(31, 61, 46, 0.16)"
            borderRadius="lg"
            padding=".25rem .6rem"
            fontSize="0.7rem"
            fontWeight={800}
            letterSpacing=".05em"
            textTransform="uppercase"
          >
            {message.label}
          </Box>
        )}
        <Box
          asChild
          fontSize="0.85rem"
          fontWeight={600}
          _hover={{ textDecoration: "underline" }}
        >
          <Link href="/#beskjeder">{message.bannerText}</Link>
        </Box>
      </Flex>
    </Box>
  );
};

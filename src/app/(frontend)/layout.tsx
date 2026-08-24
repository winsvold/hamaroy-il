import { Box, Grid } from "@chakra-ui/react";
import type { Metadata } from "next";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Footer } from "./layout/Footer";
import { Header } from "./layout/Header";
import { NewsBanner } from "./components/NewsBanner";

const faviconQuery = defineQuery(`*[_type == "siteSettings"][0]{ logo }`);

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await sanityFetch(faviconQuery, undefined, {
    // Logoen byttes sjelden, så det er ingen grunn til å spørre Sanity like ofte
    // som for innholdet ellers
    revalidate: 3600,
  });

  // Bare bredde er satt, slik at hele logoen blir med — ber vi om både bredde og
  // høyde beskjærer Sanity bildet til en firkant
  const iconUrl =
    siteSettings?.logo &&
    urlFor(siteSettings.logo).width(180).format("png").url();

  return {
    title: "Hamarøy IL",
    description: "Hjemmesidene til Hamarøy IL",
    icons: iconUrl ? { icon: iconUrl, apple: iconUrl } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Bakgrunn og tekstfarge settes her og ikke i globalCss, fordi Chakra-provideren
    // også omslutter Sanity Studio på /cms
    <Grid
      minH="100vh"
      gridTemplateRows="auto auto 1fr auto"
      background="cream"
      color="forest.700"
      fontFamily="body"
    >
      <Header />
      <NewsBanner />
      <Box as="main" paddingBottom="5rem">
        {children}
      </Box>
      <Footer />
    </Grid>
  );
}

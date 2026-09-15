import { Box, Grid } from "@chakra-ui/react";
import type { Metadata } from "next";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Footer } from "./layout/Footer";
import { Header } from "./layout/Header";

const faviconQuery = defineQuery(`*[_type == "siteSettings"][0]{ logo }`);

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await sanityFetch(faviconQuery, undefined, {
    revalidate: 3600,
  });

  // Med både bredde og høyde beskjærer Sanity logoen til en firkant
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
    // Ikke i globalCss, siden provideren også omslutter Sanity Studio
    <Grid
      minH="100vh"
      gridTemplateRows="auto 1fr auto"
      // Uten minmax(0, …) kan et langt ord gjøre siden bredere enn skjermen
      gridTemplateColumns="minmax(0, 1fr)"
      background="ground"
      color="ink"
      fontFamily="body"
    >
      <Header />
      <Box as="main">{children}</Box>
      <Footer />
    </Grid>
  );
}

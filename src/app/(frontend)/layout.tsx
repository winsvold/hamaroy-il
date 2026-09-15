import { Box, Grid } from "@chakra-ui/react";
import type { Metadata } from "next";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Footer } from "./layout/Footer";
import { Header } from "./layout/Header";
import { skyOfTheDay } from "./layout/PageHero";

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
      // Dagens himmel velges én gang for hele sidemalen. Malen beholdes når man
      // navigerer, så forsiden og en aktivitetsside kan aldri vise hver sin himmel.
      data-sky={skyOfTheDay()}
      minH="100vh"
      gridTemplateRows="auto 1fr auto"
      // Uten `minmax(0, …)` sizes kolonnen etter det bredeste min-innholdet på siden,
      // og ett langt ord i en overskrift dytter hele sidemalen bredere enn skjermen
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

import { Box, Grid } from "@chakra-ui/react";
import type { Metadata } from "next";
import { Footer } from "./layout/Footer";
import { Header } from "./layout/Header";
import { NewsBanner } from "./components/NewsBanner";

export const metadata: Metadata = {
  title: "Hamarøy IL",
  description: "Hjemmesidene til Hamarøy IL",
};

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

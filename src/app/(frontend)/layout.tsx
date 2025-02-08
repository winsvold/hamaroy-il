import { Grid } from "@chakra-ui/react";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Footer } from "./layout/Footer";
import { Header } from "./layout/Header";

const sourceSans = Source_Sans_3({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

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
    <Grid
      minH="100vh"
      gridTemplateRows="auto 1fr auto"
      className={`${sourceSans.className}`}
    >
      <Header />
      <main>{children}</main>
      <Footer />
    </Grid>
  );
}

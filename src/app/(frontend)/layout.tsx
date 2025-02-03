import { Provider } from "@/app/(frontend)/provider";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { Grid } from "@chakra-ui/react";

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
    <Provider>
      <Grid
        minH="100vh"
        gridTemplateRows="auto 1fr auto"
        className={`${sourceSans.className}`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </Grid>
    </Provider>
  );
}

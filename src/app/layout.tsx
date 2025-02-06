import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";

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
    <html lang="no" className={`${sourceSans.className}`}>
      <body>{children}</body>
    </html>
  );
}

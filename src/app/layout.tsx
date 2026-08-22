import type { Metadata } from "next";
import { Bricolage_Grotesque, Libre_Franklin } from "next/font/google";
import { Provider } from "./provider";

const display = Bricolage_Grotesque({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Libre_Franklin({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
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
    <html lang="no" className={`${display.variable} ${body.variable}`}>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

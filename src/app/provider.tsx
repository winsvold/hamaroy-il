"use client";

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

const fallbackSans = `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`;

const customConfig = defineConfig({
  globalCss: {
    html: {
      fontSize: { base: "112.5%", md: "120%" },
      // Sørger for at ankerlenker (feks /faste-aktiviteter#klatring) ikke havner
      // bak den klebrige toppmenyen
      scrollPaddingTop: "6rem",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: `var(--font-display), ${fallbackSans}` },
        body: { value: `var(--font-body), ${fallbackSans}` },
      },
      colors: {
        // Nattsvart grønn: toppmeny, bunntekst, hero og de mørke panelene
        arctic: {
          base: { value: "#0b1a17" },
          hover: { value: "#12281f" },
          ink: { value: "#111c19" },
          // Litt dypere enn toppmenyen, så nordlysgløden har noe å dø ut mot
          hero: { value: "#0a1712" },
        },
        // Nordlyset. Grønn er hovedaksenten, fiolett brukes sparsomt.
        aurora: {
          green: { value: "#4ade9f" },
          teal: { value: "#7ce0d6" },
          violet: { value: "#a48ee0" },
        },
        // Tidsblokkene i kalenderen, lenker og kategorioverskrifter på lys bakgrunn
        deep: {
          base: { value: "#0d5c4f" },
          hover: { value: "#12806d" },
          // Lys grønn tekst oppå deep.base
          light: { value: "#9fe8cd" },
        },
        // Sidebakgrunnen, en kjølig salvie. Fjellsilhuetten fylles med akkurat denne,
        // så den løser seg opp i seksjonen under.
        ground: { value: "#e9edeb" },
        // Alle kort og lyse paneler. Hvitt mot salviegrunnen skiller dem — ingen kant,
        // ingen skygge. Designets grå panelfarge (#e6ece9) er utelatt: mot den nye
        // grunnen var den så godt som usynlig.
        card: {
          base: { value: "#ffffff" },
          hover: { value: "#f7fbf9" },
        },
        // Den bakre fjellryggen
        sage: {
          deep: { value: "#c7d5d0" },
        },
        // Tekst på lys bakgrunn
        ink: { value: "#111c19" },
        prose: { value: "#2b3a35" },
        secondary: { value: "#3f4f4a" },
        muted: { value: "#5d6d68" },
        // Tekst på mørk bakgrunn, fra sterkest til svakest
        onDark: {
          base: { value: "#f4faf8" },
          secondary: { value: "#c3d6d0" },
          soft: { value: "#b8ccc6" },
          tertiary: { value: "#9fb8b2" },
          // Lysere enn designets første forslag (#6b8079), som ikke nådde 4.5:1 på
          // den lille teksten nederst i bunnteksten
          faint: { value: "#8aa39d" },
        },
        // Tekst oppå den grønne knappen
        onAurora: { value: "#062018" },
        // Mindre tekst på grønt: ukedag og måned i datobrikka
        onAuroraSoft: { value: "#0b4a3a" },
        hairline: { value: "rgba(17, 28, 25, 0.14)" },
        hairlineDark: { value: "rgba(195, 214, 208, 0.28)" },
        hairlineDarkFaint: { value: "rgba(195, 214, 208, 0.22)" },
      },
    },
    textStyles: {
      /**
       * Den lille versale etiketten. Rendyrket merkelapp — seksjonsoverskrifter er
       * `SectionHeading` og settes i Syne.
       */
      kicker: {
        value: {
          fontFamily: "body",
          fontWeight: "700",
          fontSize: "0.65625rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, customConfig);

function EmotionRegistry(props: Props) {
  const [cache] = useState(() => {
    const instance = createCache({ key: "css" });
    instance.compat = true;
    return instance;
  });

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  return <CacheProvider value={cache}>{props.children}</CacheProvider>;
}

export function Provider(props: Props) {
  return (
    <EmotionRegistry>
      <ChakraProvider value={system}>{props.children}</ChakraProvider>
    </EmotionRegistry>
  );
}

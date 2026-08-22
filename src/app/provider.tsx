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
      // Sørger for at ankerlenker (feks «Våre grupper» → /faste-aktiviteter#klatring)
      // ikke havner bak den klebrige toppmenyen
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
        // Skogsgrønn – hovedfargen. 700 er «forest», 600 er «moss» fra designet.
        forest: {
          50: { value: "#eef2ea" },
          100: { value: "#dde7de" },
          200: { value: "#cfe0d1" },
          300: { value: "#a8c3ac" },
          400: { value: "#8fae95" },
          500: { value: "#3f7259" },
          600: { value: "#2f5a45" },
          700: { value: "#1f3d2e" },
          800: { value: "#18301f" },
          900: { value: "#112418" },
          950: { value: "#0b1810" },
        },
        // Rav/terrakotta – aksentfargen. 500 er «amber», 700 er «terracotta».
        amber: {
          50: { value: "#fdf1e2" },
          100: { value: "#f9e0c2" },
          200: { value: "#f4cb9b" },
          300: { value: "#edb471" },
          400: { value: "#e6a253" },
          500: { value: "#e0923f" },
          600: { value: "#d17e33" },
          700: { value: "#c1682e" },
          800: { value: "#9c5326" },
          900: { value: "#7c421f" },
          950: { value: "#4d2813" },
        },
        // Flater og tekst som ikke hører hjemme i en skala
        cream: { value: "#f7f2e6" },
        surface: { value: "#fdfaf3" },
        onDark: { value: "#f2ede2" },
        muted: { value: "#5a6b58" },
        hairline: { value: "rgba(31, 61, 46, 0.1)" },
        hairlineStrong: { value: "rgba(31, 61, 46, 0.25)" },
      },
      radii: {
        sm: { value: "0.375rem" },
        md: { value: "0.5rem" },
        lg: { value: "0.625rem" },
        xl: { value: "0.75rem" },
        "2xl": { value: "0.875rem" },
        "3xl": { value: "1.25rem" },
      },
    },
    semanticTokens: {
      colors: {
        forest: {
          solid: { value: "{colors.forest.700}" },
          contrast: { value: "{colors.onDark}" },
          fg: { value: "{colors.forest.700}" },
          subtle: { value: "{colors.forest.50}" },
          muted: { value: "{colors.forest.100}" },
          emphasized: { value: "{colors.forest.800}" },
          focusRing: { value: "{colors.forest.600}" },
          border: { value: "{colors.hairline}" },
        },
        amber: {
          solid: { value: "{colors.amber.500}" },
          contrast: { value: "{colors.forest.700}" },
          fg: { value: "{colors.amber.700}" },
          subtle: { value: "{colors.amber.50}" },
          muted: { value: "{colors.amber.100}" },
          emphasized: { value: "{colors.amber.600}" },
          focusRing: { value: "{colors.amber.500}" },
          border: { value: "{colors.amber.500}" },
        },
      },
    },
    textStyles: {
      // Den lille versale etiketten over hver seksjon
      kicker: {
        value: {
          fontFamily: "mono",
          fontWeight: "800",
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
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

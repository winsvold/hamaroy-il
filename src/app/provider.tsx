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
      // Ankerlenker skal ikke havne bak den klebrige toppmenyen
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
        arctic: {
          base: { value: "#0b1a17" },
          hover: { value: "#12281f" },
          hero: { value: "#0a1712" },
        },
        aurora: {
          green: { value: "#4ade9f" },
          teal: { value: "#7ce0d6" },
        },
        deep: {
          base: { value: "#0d5c4f" },
          hover: { value: "#12806d" },
          // Tekst oppå deep.base
          light: { value: "#9fe8cd" },
        },
        ground: { value: "#e9edeb" },
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
        // Tekst på mørk bakgrunn
        onDark: {
          base: { value: "#f4faf8" },
          secondary: { value: "#c3d6d0" },
          soft: { value: "#b8ccc6" },
          tertiary: { value: "#9fb8b2" },
          faint: { value: "#8aa39d" },
        },
        // Tekst oppå aurora.green
        onAurora: { value: "#062018" },
        onAuroraSoft: { value: "#0b4a3a" },
      },
    },
    textStyles: {
      kicker: {
        value: {
          fontFamily: "body",
          fontWeight: "bold",
          fontSize: "2xs",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, customConfig);

function EmotionRegistry(props: Props) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;

    // Husker nye stiler, så hver del av en strømmet side bare sender sine egne
    const insert = cache.insert;
    let names: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        names.push(serialized.name);
      }
      return insert(...args);
    };
    const flush = () => {
      const flushed = names;
      names = [];
      return flushed;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (!names.length) return null;

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: names.map((name) => cache.inserted[name]).join(" "),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{props.children}</CacheProvider>;
}

export function Provider(props: Props) {
  return (
    <EmotionRegistry>
      <ChakraProvider value={system}>{props.children}</ChakraProvider>
    </EmotionRegistry>
  );
}

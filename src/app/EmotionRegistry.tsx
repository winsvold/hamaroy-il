import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

// This keeps Emotion styles in the streamed HTML so pages are styled before hydration
// and do not briefly render without their generated CSS.
export function EmotionRegistry(props: Props) {
  const [{ cache, flush }] = useState(() => {
    // Keep a cache instance stable for this registry so styles are collected
    // during rendering and can be emitted by useServerInsertedHTML below.
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

  // Inject only the styles collected since the previous streamed HTML chunk.
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

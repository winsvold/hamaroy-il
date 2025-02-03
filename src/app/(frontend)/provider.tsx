"use client";

import {
  ChakraProvider,
  defineConfig,
  defaultConfig,
  createSystem,
} from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};

const customConfig = defineConfig({
  globalCss: {
    html: {
      fontSize: { base: "112.5%", md: "120%" },
    },
  },
});

const system = createSystem(defaultConfig, customConfig);

export function Provider(props: Props) {
  return <ChakraProvider value={system} {...props} />;
}

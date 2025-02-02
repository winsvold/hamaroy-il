"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};

export function Provider(props: Props) {
  return <ChakraProvider value={defaultSystem} {...props} />;
}

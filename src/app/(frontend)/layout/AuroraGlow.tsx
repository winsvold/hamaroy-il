import { Box } from "@chakra-ui/react";

export const AuroraGlow = () => (
  <>
    <Box
      position="absolute"
      left="0"
      right="0"
      bottom="0"
      height="25rem"
      backgroundImage="radial-gradient(120% 78% at 62% 100%, rgba(74, 222, 159, 0.42) 0%, rgba(74, 222, 159, 0.14) 32%, rgba(124, 224, 214, 0.05) 52%, transparent 66%)"
    />
    <Box
      position="absolute"
      left="0"
      right="0"
      bottom="0"
      height="20rem"
      backgroundImage="radial-gradient(70% 66% at 22% 100%, rgba(164, 142, 224, 0.3) 0%, rgba(164, 142, 224, 0.06) 45%, transparent 62%)"
    />
  </>
);

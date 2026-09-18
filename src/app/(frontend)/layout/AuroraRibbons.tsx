import { Box } from "@chakra-ui/react";

/** Gradient-id-ene er faste, siden en side bare har ett toppfelt */
export const AuroraRibbons = () => (
  <Box
    position="absolute"
    top="0"
    right="-1.25rem"
    width={{ base: "25rem", md: "40rem" }}
    height="100%"
    filter="blur(1rem)"
  >
    <svg
      viewBox="0 0 640 400"
      preserveAspectRatio="xMaxYMid meet"
      width="100%"
      height="100%"
    >
      <defs>
        <linearGradient id="ribbons-1" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#4ade9f" stopOpacity="0" />
          <stop offset=".45" stopColor="#4ade9f" stopOpacity=".5" />
          <stop offset="1" stopColor="#7ce0d6" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id="ribbons-2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#7ce0d6" stopOpacity="0" />
          <stop offset=".5" stopColor="#7ce0d6" stopOpacity=".42" />
          <stop offset="1" stopColor="#a48ee0" stopOpacity=".1" />
        </linearGradient>
      </defs>
      <path
        d="M20 300C150 190 300 250 380 96 430 6 540 46 640 6"
        stroke="url(#ribbons-1)"
        strokeWidth="58"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M40 356C170 250 310 306 386 156 442 62 540 100 634 62"
        stroke="url(#ribbons-2)"
        strokeWidth="26"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  </Box>
);

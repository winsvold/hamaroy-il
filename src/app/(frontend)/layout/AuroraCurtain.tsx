import { Box } from "@chakra-ui/react";

/** Gradient-id-ene er faste, siden en side bare har ett toppfelt */
export const AuroraCurtain = () => (
  <Box
    position="absolute"
    top="0"
    left="0"
    width="100%"
    height="60%"
    filter="blur(.5625rem)"
  >
    <svg
      viewBox="0 0 1440 300"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
    >
      <defs>
        <linearGradient id="curtain-1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4ade9f" stopOpacity=".6" />
          <stop offset=".55" stopColor="#4ade9f" stopOpacity=".15" />
          <stop offset="1" stopColor="#4ade9f" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="curtain-2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a48ee0" stopOpacity=".48" />
          <stop offset=".6" stopColor="#7ce0d6" stopOpacity=".12" />
          <stop offset="1" stopColor="#7ce0d6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="url(#curtain-1)">
        <path d="M700 14l26 216-14 0-30-206z" />
        <path d="M760 4l30 248-16 0-32-236z" />
        <path d="M826 18l24 204-14 0-26-194z" />
        <path d="M888 0l32 260-18 0-32-248z" />
        <path d="M952 22l22 192-14 0-24-182z" />
        <path d="M1016 8l30 232-16 0-30-220z" />
        <path d="M1084 26l22 180-14 0-24-170z" />
        <path d="M1148 6l30 240-16 0-30-228z" />
        <path d="M1216 28l22 174-14 0-24-164z" />
      </g>
      <g fill="url(#curtain-2)">
        <path d="M646 30l22 162-12 0-24-152z" />
        <path d="M1282 34l22 156-12 0-24-146z" />
        <path d="M1340 16l26 186-14 0-26-176z" />
      </g>
    </svg>
  </Box>
);

import { Box } from "@chakra-ui/react";

/** Gradientstoppene fra designfilene. Undersidene har litt svakere lys. */
const stops = {
  bright: { green: 0.5, teal: 0.12, teal2: 0.42, violet: 0.1 },
  dimmed: { green: 0.42, teal: 0.1, teal2: 0.35, violet: 0.08 },
};

/**
 * Himmel a, «Bånd»: to buede lysbånd på høyre halvdel av toppfeltet, klar av den
 * venstrestilte overskriften.
 *
 * Gradient-id-ene er faste: det står aldri mer enn ett toppfelt på en side.
 */
export const AuroraRibbons = ({ dimmed }: { dimmed?: boolean }) => {
  const stop = stops[dimmed ? "dimmed" : "bright"];

  return (
    <Box
      position="absolute"
      top="0"
      right="-1.25rem"
      width={{ base: "26rem", md: "41.25rem" }}
      height="100%"
      // Uskarpheten bærer uttrykket: uten den leses båndene som malte striper
      filter="blur(1.0625rem)"
    >
      {/* `meet` holder båndene hele i de lavere toppfeltene på undersidene */}
      <svg
        viewBox="0 0 640 400"
        preserveAspectRatio="xMaxYMid meet"
        width="100%"
        height="100%"
        pointerEvents="none"
      >
        <defs>
          <linearGradient id="sky-a-1" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#4ade9f" stopOpacity="0" />
            <stop offset=".45" stopColor="#4ade9f" stopOpacity={stop.green} />
            <stop offset="1" stopColor="#7ce0d6" stopOpacity={stop.teal} />
          </linearGradient>
          <linearGradient id="sky-a-2" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#7ce0d6" stopOpacity="0" />
            <stop offset=".5" stopColor="#7ce0d6" stopOpacity={stop.teal2} />
            <stop offset="1" stopColor="#a48ee0" stopOpacity={stop.violet} />
          </linearGradient>
        </defs>
        <path
          d="M20 300C150 190 300 250 380 96 430 6 540 46 640 6"
          stroke="url(#sky-a-1)"
          strokeWidth="58"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M40 356C170 250 310 306 386 156 442 62 540 100 634 62"
          stroke="url(#sky-a-2)"
          strokeWidth="26"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </Box>
  );
};

import { Box } from "@chakra-ui/react";

/** Gradientstoppene og høyden fra designfilene. Undersidene har litt svakere lys. */
const variants = {
  bright: { green: 0.6, green2: 0.15, violet: 0.48, teal: 0.12, height: "62%" },
  dimmed: { green: 0.55, green2: 0.14, violet: 0.44, teal: 0.1, height: "58%" },
};

/**
 * Himmel b, «Gardin»: stråler som henger ned fra toppen av toppfeltet, på høyre
 * halvdel. Høyden i prosent av feltet sørger for at de stopper godt over fjellrekka.
 *
 * Gradient-id-ene er faste: det står aldri mer enn ett toppfelt på en side.
 */
export const AuroraCurtain = ({ dimmed }: { dimmed?: boolean }) => {
  const variant = variants[dimmed ? "dimmed" : "bright"];

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height={variant.height}
      // Uskarpheten bærer uttrykket: uten den leses strålene som malte striper
      filter="blur(.5625rem)"
    >
      {/*
        Den ujevne skaleringen (`none`) vrir strålene litt ut av loddlinja, noe som
        leser riktig som et gardin.
      */}
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        pointerEvents="none"
      >
        <defs>
          <linearGradient id="sky-b-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4ade9f" stopOpacity={variant.green} />
            <stop
              offset=".55"
              stopColor="#4ade9f"
              stopOpacity={variant.green2}
            />
            <stop offset="1" stopColor="#4ade9f" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sky-b-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a48ee0" stopOpacity={variant.violet} />
            <stop offset=".6" stopColor="#7ce0d6" stopOpacity={variant.teal} />
            <stop offset="1" stopColor="#7ce0d6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill="url(#sky-b-1)">
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
        <g fill="url(#sky-b-2)">
          <path d="M646 30l22 162-12 0-24-152z" />
          <path d="M1282 34l22 156-12 0-24-146z" />
          <path d="M1340 16l26 186-14 0-26-176z" />
        </g>
      </svg>
    </Box>
  );
};

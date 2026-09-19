import { DefaultContainer } from "@/components/DefaultContainer";
import { Box } from "@chakra-ui/react";
import { getDayOfYear } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { AuroraCurtain } from "./AuroraCurtain";
import { AuroraGlow } from "./AuroraGlow";
import { AuroraRibbons } from "./AuroraRibbons";
import { MountainRange } from "./MountainRange";

const variants = {
  front: {
    paddingTop: { base: "2rem", md: "3rem" },
    rangeHeight: { base: "7rem", md: "14rem" },
    skyOpacity: 1,
  },
  page: {
    paddingTop: { base: "2rem", md: "3rem" },
    rangeHeight: { base: "6rem", md: "11rem" },
    skyOpacity: 0.85,
  },
  detail: {
    paddingTop: { base: "1.75rem", md: "2rem" },
    rangeHeight: { base: "5.5rem", md: "11rem" },
    skyOpacity: 0.85,
  },
};

const skies = [AuroraRibbons, AuroraCurtain, AuroraGlow];

// Ny himmel hver dag. Dagen regnes i norsk tid, siden serveren går i UTC.
const skyOfTheDay = () =>
  skies[getDayOfYear(toZonedTime(new Date(), "Europe/Oslo")) % skies.length];

type Props = {
  variant?: keyof typeof variants;
  children: React.ReactNode;
};

export const PageHero = ({ variant = "page", children }: Props) => {
  const { paddingTop, rangeHeight, skyOpacity } = variants[variant];
  const Sky = skyOfTheDay();

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      background="arctic.hero"
      color="onDark.base"
      paddingTop={paddingTop}
    >
      <Box
        position="absolute"
        inset="0"
        opacity={skyOpacity}
        pointerEvents="none"
        aria-hidden="true"
      >
        <Sky />
      </Box>

      {/* Innholdet slutter der fjellrekka begynner, ellers dekker toppene teksten */}
      <DefaultContainer position="relative" paddingBottom={rangeHeight}>
        {children}
      </DefaultContainer>

      <MountainRange height={rangeHeight} />
    </Box>
  );
};

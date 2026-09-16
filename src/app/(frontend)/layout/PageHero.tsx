import { DefaultContainer } from "@/components/DefaultContainer";
import { Box } from "@chakra-ui/react";
import { getDayOfYear } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { AuroraCurtain } from "./AuroraCurtain";
import { AuroraGlow } from "./AuroraGlow";
import { AuroraRibbons } from "./AuroraRibbons";
import { MountainRange } from "./MountainRange";

type Variant = "front" | "page" | "detail";

const variants = {
  front: {
    paddingTop: { base: "2rem", md: "3rem" },
    paddingBottom: { base: "5rem", md: "11rem" },
    rangeHeight: { base: "7rem", md: "14rem" },
  },
  page: {
    paddingTop: { base: "2rem", md: "3rem" },
    paddingBottom: { base: "4rem", md: "8rem" },
    rangeHeight: { base: "6rem", md: "11rem" },
  },
  detail: {
    paddingTop: { base: "1.75rem", md: "2rem" },
    paddingBottom: { base: "3.5rem", md: "7.5rem" },
    rangeHeight: { base: "5.5rem", md: "11rem" },
  },
} satisfies Record<Variant, unknown>;

const skies = [AuroraRibbons, AuroraCurtain, AuroraGlow];

// Ny himmel hver dag. Dagen regnes i norsk tid, siden serveren går i UTC.
const skyOfTheDay = () =>
  skies[getDayOfYear(toZonedTime(new Date(), "Europe/Oslo")) % skies.length];

type Props = {
  variant?: Variant;
  children: React.ReactNode;
};

export const PageHero = ({ variant = "page", children }: Props) => {
  const Sky = skyOfTheDay();

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      background="arctic.hero"
      paddingTop={variants[variant].paddingTop}
    >
      <Box
        position="absolute"
        inset="0"
        opacity={variant === "front" ? 1 : 0.85}
        pointerEvents="none"
        aria-hidden="true"
      >
        <Sky />
      </Box>

      <DefaultContainer
        position="relative"
        paddingBottom={variants[variant].paddingBottom}
      >
        {children}
      </DefaultContainer>

      <MountainRange
        back="sage.deep"
        front="ground"
        height={variants[variant].rangeHeight}
      />
    </Box>
  );
};

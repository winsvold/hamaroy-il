import { DefaultContainer } from "@/components/DefaultContainer";
import { Box, SystemStyleObject } from "@chakra-ui/react";
import { getDayOfYear } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { AuroraCurtain } from "./AuroraCurtain";
import { AuroraGlow } from "./AuroraGlow";
import { AuroraRibbons } from "./AuroraRibbons";
import { MountainRange } from "./MountainRange";

/** Det mørke toppfeltet: nordlyset bak horisonten, og fjellsilhuetten langs bunnen. */

type Variant = "front" | "page" | "detail";

/**
 * Fjellrekka strekkes med `preserveAspectRatio="none"`, så en bane tegnet 1440 bred
 * klemmes ~3,7 ganger sammen på mobil. Lavere rekke der demper forvrengningen.
 */
const variants = {
  front: {
    paddingTop: { base: "2rem", md: "2.875rem" },
    paddingBottom: { base: "5rem", md: "10.625rem" },
    rangeHeight: { base: "7rem", md: "13.75rem" },
  },
  page: {
    paddingTop: { base: "2rem", md: "2.75rem" },
    paddingBottom: { base: "4rem", md: "8.125rem" },
    rangeHeight: { base: "6rem", md: "11.25rem" },
  },
  detail: {
    paddingTop: { base: "1.75rem", md: "2rem" },
    paddingBottom: { base: "3.5rem", md: "7.5rem" },
    rangeHeight: { base: "5.5rem", md: "10.625rem" },
  },
} satisfies Record<Variant, unknown>;

/**
 * Tre himler, én per kalenderdag. De deler palett og fjellrekke, så det eneste som
 * endrer seg fra dag til dag er lyset:
 *  - a, «Bånd»: to buede lysbånd på høyre halvdel
 *  - b, «Gardin»: stråler som henger ned fra toppen av feltet
 *  - c, «Skimmer»: en glød som stiger bak fjellene
 */
export type Sky = "a" | "b" | "c";

/**
 * Dagens himmel. Seedet på datoen, aldri på forespørselen: en tilfeldig himmel ville
 * byttet når noen trykker tilbake, mens datoen gir hele bygda samme himmel samme dag.
 *
 * Dagen regnes i norsk tid. Serveren går i UTC, og ville ellers byttet himmel klokka
 * ett eller to om natta.
 */
export const skyOfTheDay = (now = new Date()): Sky =>
  (["a", "b", "c"] as const)[getDayOfYear(toZonedTime(now, "Europe/Oslo")) % 3];

/**
 * Alle tre himlene ligger i markupen, og `data-sky` på sidemalen velger hvilken som
 * vises. Skimmer er standard dersom attributtet mangler — den tåler mest tekst over
 * seg. Skjulte lag får også `visibility: hidden`, så nettleseren slipper å tegne
 * uskarpe SVG-er ingen ser.
 */
const skyLayer = (sky: Sky): SystemStyleObject => {
  const hidden = { opacity: 0, visibility: "hidden" } as const;
  const shown = { opacity: 1, visibility: "visible" } as const;
  return {
    position: "absolute",
    inset: "0",
    // Lagene dekker hele feltet; teksten skal kunne markeres gjennom dem
    pointerEvents: "none",
    transition: "opacity .4s ease, visibility .4s",
    ...(sky === "c"
      ? {
          ...shown,
          '[data-sky="a"] &': hidden,
          '[data-sky="b"] &': hidden,
        }
      : { ...hidden, [`[data-sky="${sky}"] &`]: shown }),
  };
};

type Props = {
  variant?: Variant;
  children: React.ReactNode;
};

export const PageHero = ({ variant = "page", children }: Props) => {
  // Lyset dempes litt på undersidene
  const dimmed = variant !== "front";

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      background="arctic.hero"
      paddingTop={variants[variant].paddingTop}
    >
      <Box css={skyLayer("a")} aria-hidden="true">
        <AuroraRibbons dimmed={dimmed} />
      </Box>
      <Box css={skyLayer("b")} aria-hidden="true">
        <AuroraCurtain dimmed={dimmed} />
      </Box>
      <Box css={skyLayer("c")} aria-hidden="true">
        <AuroraGlow />
      </Box>

      <DefaultContainer
        position="relative"
        paddingBottom={variants[variant].paddingBottom}
      >
        {children}
      </DefaultContainer>

      {/*
        Fylles med sidebakgrunnen, ikke en egen fjellfarge: rekka skal lese som
        horisonten og gli rett over i seksjonen under uten en synlig skjøt.
      */}
      <MountainRange
        back="sage.deep"
        front="ground"
        height={variants[variant].rangeHeight}
      />
    </Box>
  );
};

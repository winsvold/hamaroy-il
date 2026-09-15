import { DefaultContainer } from "@/components/DefaultContainer";
import { Box, SystemStyleObject } from "@chakra-ui/react";
import { getDayOfYear } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { mountainRange } from "./mountainRange";

/**
 * Det mørke toppfeltet: nordlyset bak horisonten, og fjellsilhuetten langs bunnen.
 *
 * Fjellrekka er kopiert ordrett fra designet. Den er tegnet av etter et bilde av
 * horisonten i Hamarøy — inkludert Stetind-spiret — så banene skal ikke forenkles.
 * Begge må dessuten ende på `H1440` for å nå helt ut til høyre kant.
 */

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

/** Lyset dempes litt på undersidene. Tallene er gradientstoppene fra designfilene. */
const intensity = {
  front: {
    ribbon: { green: 0.5, teal: 0.12, teal2: 0.42, violet: 0.1 },
    curtain: { green: 0.6, green2: 0.15, violet: 0.48, teal: 0.12 },
    curtainHeight: "62%",
  },
  sub: {
    ribbon: { green: 0.42, teal: 0.1, teal2: 0.35, violet: 0.08 },
    curtain: { green: 0.55, green2: 0.14, violet: 0.44, teal: 0.1 },
    curtainHeight: "58%",
  },
};

type Props = {
  variant?: Variant;
  children: React.ReactNode;
};

export const PageHero = ({ variant = "page", children }: Props) => {
  const light = intensity[variant === "front" ? "front" : "sub"];

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      background="arctic.hero"
      paddingTop={variants[variant].paddingTop}
    >
      {/*
        Gradient-id-ene er faste: det står aldri mer enn ett toppfelt på en side.

        Uskarpheten bærer uttrykket. Uten den leses båndene og strålene som flate,
        malte striper med harde kanter i stedet for lys.
      */}
      <Box css={skyLayer("a")} aria-hidden="true">
        <Box
          position="absolute"
          top="0"
          right="-1.25rem"
          width={{ base: "26rem", md: "41.25rem" }}
          height="100%"
          filter="blur(1.0625rem)"
        >
          {/* `meet` holder båndene hele i de lavere toppfeltene på undersidene */}
          <svg
            viewBox="0 0 640 400"
            preserveAspectRatio="xMaxYMid meet"
            width="100%"
            height="100%"
          >
            <defs>
              <linearGradient id="sky-a-1" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#4ade9f" stopOpacity="0" />
                <stop
                  offset=".45"
                  stopColor="#4ade9f"
                  stopOpacity={light.ribbon.green}
                />
                <stop
                  offset="1"
                  stopColor="#7ce0d6"
                  stopOpacity={light.ribbon.teal}
                />
              </linearGradient>
              <linearGradient id="sky-a-2" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#7ce0d6" stopOpacity="0" />
                <stop
                  offset=".5"
                  stopColor="#7ce0d6"
                  stopOpacity={light.ribbon.teal2}
                />
                <stop
                  offset="1"
                  stopColor="#a48ee0"
                  stopOpacity={light.ribbon.violet}
                />
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
      </Box>

      <Box css={skyLayer("b")} aria-hidden="true">
        {/*
          Den ujevne skaleringen (`none`) vrir strålene litt ut av loddlinja, noe som
          leser riktig som et gardin. Høyden i prosent av feltet sørger for at de
          stopper godt over fjellrekka.
        */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height={light.curtainHeight}
          filter="blur(.5625rem)"
        >
          <svg
            viewBox="0 0 1440 300"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
          >
            <defs>
              <linearGradient id="sky-b-1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0"
                  stopColor="#4ade9f"
                  stopOpacity={light.curtain.green}
                />
                <stop
                  offset=".55"
                  stopColor="#4ade9f"
                  stopOpacity={light.curtain.green2}
                />
                <stop offset="1" stopColor="#4ade9f" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="sky-b-2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0"
                  stopColor="#a48ee0"
                  stopOpacity={light.curtain.violet}
                />
                <stop
                  offset=".6"
                  stopColor="#7ce0d6"
                  stopOpacity={light.curtain.teal}
                />
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
      </Box>

      {/*
        To radielle gradienter som stiger fra bunnen: en bred grønn bue forskjøvet mot
        høyre og en smalere fiolett mot venstre. Fargene er aurora.green, .teal og
        .violet, skrevet ut fordi gradientene trenger dem med gjennomsiktighet.
      */}
      <Box css={skyLayer("c")} aria-hidden="true">
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
          height="21.875rem"
          backgroundImage="radial-gradient(70% 66% at 22% 100%, rgba(164, 142, 224, 0.3) 0%, rgba(164, 142, 224, 0.06) 45%, transparent 62%)"
        />
      </Box>

      <DefaultContainer
        position="relative"
        paddingBottom={variants[variant].paddingBottom}
      >
        {children}
      </DefaultContainer>

      <Box
        position="absolute"
        left="0"
        bottom="0"
        width="100%"
        height={variants[variant].rangeHeight}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: "block" }}
        >
          <path
            d={mountainRange.back}
            fill="var(--chakra-colors-sage-deep)"
            opacity=".55"
          />
          {/*
            Fylles med sidebakgrunnen, ikke en egen fjellfarge: rekka skal lese som
            horisonten og gli rett over i seksjonen under uten en synlig skjøt.
          */}
          <path d={mountainRange.front} fill="var(--chakra-colors-ground)" />
        </svg>
      </Box>
    </Box>
  );
};

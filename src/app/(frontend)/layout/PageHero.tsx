import { DefaultContainer } from "@/components/DefaultContainer";
import { Box } from "@chakra-ui/react";

/**
 * Det mørke toppfeltet: nordlys øverst til høyre og fjellsilhuetten langs bunnen.
 *
 * Begge SVG-ene er kopiert ordrett fra designet. Fjellrekka er tegnet av etter et
 * bilde av horisonten i Hamarøy — inkludert Stetind-spiret — så banene skal ikke
 * forenkles. Begge må dessuten ende på `H1440` for å nå helt ut til høyre kant.
 */

type Variant = "front" | "page" | "detail";

/**
 * Nordlyset dempes nedover i hierarkiet: sterkest på forsiden, svakest på en
 * enkeltside. Tallene er gradientstoppene fra hver av designfilene.
 *
 * Fjellrekka strekkes med `preserveAspectRatio="none"`, så en bane tegnet 1440 bred
 * klemmes ~3,7 ganger sammen på mobil. Lavere rekke der demper forvrengningen.
 */
const variants = {
  front: {
    paddingTop: { base: "2rem", md: "2.875rem" },
    paddingBottom: { base: "5rem", md: "10.625rem" },
    rangeHeight: { base: "7rem", md: "13.75rem" },
    auroraTop: { base: "-1.5rem", md: "-2.5rem" },
    stops: { green: 0.5, teal: 0.12, teal2: 0.42, violet: 0.1 },
  },
  page: {
    paddingTop: { base: "2rem", md: "2.75rem" },
    paddingBottom: { base: "4rem", md: "8.125rem" },
    rangeHeight: { base: "6rem", md: "11.25rem" },
    auroraTop: { base: "-2.5rem", md: "-4.375rem" },
    stops: { green: 0.42, teal: 0.1, teal2: 0.35, violet: 0.08 },
  },
  detail: {
    paddingTop: { base: "1.75rem", md: "2rem" },
    paddingBottom: { base: "3.5rem", md: "7.5rem" },
    rangeHeight: { base: "5.5rem", md: "10.625rem" },
    auroraTop: { base: "-3rem", md: "-5.625rem" },
    stops: { green: 0.4, teal: 0.1, teal2: 0.32, violet: 0.08 },
  },
} satisfies Record<Variant, unknown>;

type Props = {
  variant?: Variant;
  children: React.ReactNode;
};

export const PageHero = ({ variant = "page", children }: Props) => {
  const { stops } = variants[variant];
  // Unik per variant, så to hero-er på samme side ikke kan dele gradientdefinisjon
  const id = (n: number) => `aurora-${variant}-${n}`;

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      background="arctic.base"
      paddingTop={variants[variant].paddingTop}
    >
      <Box
        position="absolute"
        right={{ base: "-2rem", md: "-1.25rem" }}
        top={variants[variant].auroraTop}
        width={{ base: "26rem", md: "41.25rem" }}
        height={{ base: "18.5rem", md: "29.375rem" }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 640 400" width="100%" height="100%">
          <defs>
            <linearGradient id={id(1)} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#4ade9f" stopOpacity="0" />
              <stop
                offset=".45"
                stopColor="#4ade9f"
                stopOpacity={stops.green}
              />
              <stop offset="1" stopColor="#7ce0d6" stopOpacity={stops.teal} />
            </linearGradient>
            <linearGradient id={id(2)} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#7ce0d6" stopOpacity="0" />
              <stop offset=".5" stopColor="#7ce0d6" stopOpacity={stops.teal2} />
              <stop offset="1" stopColor="#a48ee0" stopOpacity={stops.violet} />
            </linearGradient>
          </defs>
          <path
            d="M20 300C150 190 300 250 380 96 430 6 540 46 640 6"
            stroke={`url(#${id(1)})`}
            strokeWidth="58"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M40 356C170 250 310 306 386 156 442 62 540 100 634 62"
            stroke={`url(#${id(2)})`}
            strokeWidth="26"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
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
            d="M0 220V196l90-26 96 22 84-34 120 26 96-18 130 30 110-22 128 26 96-16 130 24 110-18 150 22H1440v200z"
            fill="var(--chakra-colors-sage-deep)"
            opacity=".55"
          />
          {/*
            Fylles med sidebakgrunnen, ikke en egen fjellfarge: rekka skal lese som
            horisonten og gli rett over i seksjonen under uten en synlig skjøt.
          */}
          <path
            d="M0 220V184l72-32 52 20 66-10 74-58 68-22 92 8 62 38 40-14 44 24 26 4 10-72 12 72 46 10 52-24 42-24 34 14 26-22 30 26 70 22 100 20 100-8 150 20 100-10H1440v76z"
            fill="var(--chakra-colors-snow)"
          />
        </svg>
      </Box>
    </Box>
  );
};

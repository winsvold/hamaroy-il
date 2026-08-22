import { Kicker } from "@/components/Kicker";
import { sanityFetch } from "@/sanity/lib/client";
import { resolveSport, Sport, SportAccent, sports } from "@/sanity/sports";
import { Box, Grid, LinkBox, LinkOverlay, Stack, Text } from "@chakra-ui/react";
import { defineQuery } from "next-sanity";
import Link from "next/link";
import { unique } from "radash";

const sportsInUseQuery = defineQuery(`*[_type in ["sessionSeries", "event"]]{
  title,
  sport,
}`);

/** Bakgrunn/tekst per aksentfarge, slik at flisene roterer gjennom paletten */
const accentStyles: Record<
  SportAccent,
  { background: string; color: string; linkColor: string }
> = {
  forest: { background: "forest.700", color: "onDark", linkColor: "onDark" },
  amber: {
    background: "amber.500",
    color: "forest.700",
    linkColor: "forest.700",
  },
  terracotta: { background: "amber.700", color: "onDark", linkColor: "onDark" },
  moss: { background: "forest.600", color: "onDark", linkColor: "onDark" },
  tint: { background: "amber.50", color: "forest.700", linkColor: "amber.700" },
  mist: {
    background: "forest.50",
    color: "forest.700",
    linkColor: "forest.600",
  },
};

/**
 * «Våre grupper». Designet viser seks faste fliser, men vi rendrer bare idretter som
 * faktisk har aktiviteter — ellers leder en flis til en tom seksjon.
 */
export const SportTiles = async () => {
  const activities = await sanityFetch(sportsInUseQuery);

  const idsInUse = unique(
    activities.map((activity) => resolveSport(activity)?.id).filter(Boolean),
  );
  const visible: Sport[] = sports.filter((sport) =>
    idsInUse.includes(sport.id),
  );

  if (!visible.length) return null;

  return (
    <Stack gap="1.25rem" as="section">
      <Kicker as="h2">Våre grupper</Kicker>
      <Grid
        gridTemplateColumns={{
          base: "1fr 1fr",
          md: "repeat(3, 1fr)",
        }}
        gap="1rem"
      >
        {visible.map((sport) => {
          const style = accentStyles[sport.accent];
          return (
            <LinkBox
              key={sport.id}
              display="flex"
              flexDirection="column"
              gap=".6rem"
              minHeight={{ base: "auto", md: "9.5rem" }}
              padding={{ base: "1rem", md: "1.4rem" }}
              borderRadius="2xl"
              background={style.background}
              color={style.color}
              transition="transform .2s"
              _hover={{ transform: "translateY(-0.125rem)" }}
            >
              <Box
                fontSize={{ base: "1.5rem", md: "1.875rem" }}
                aria-hidden="true"
              >
                {sport.emoji}
              </Box>
              <LinkOverlay _hover={{ textDecoration: "underline" }} asChild>
                <Link href={`/faste-aktiviteter#${sport.id}`}>
                  <Box
                    fontWeight={700}
                    fontSize={{ base: "0.85rem", md: "1.03rem" }}
                  >
                    {sport.title}
                  </Box>
                </Link>
              </LinkOverlay>
              <Text
                display={{ base: "none", md: "block" }}
                fontSize="0.78rem"
                fontWeight={500}
                lineHeight={1.5}
                opacity={0.85}
              >
                {sport.description}
              </Text>
              <Box
                marginTop="auto"
                fontWeight={700}
                fontSize="0.75rem"
                color={style.linkColor}
                display={{ base: "none", md: "block" }}
              >
                Se mer →
              </Box>
            </LinkBox>
          );
        })}
      </Grid>
    </Stack>
  );
};

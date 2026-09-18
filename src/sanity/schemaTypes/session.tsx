import { formatNorwegianDate } from "@/utils/date";
import { Button, Flex, Text, TextInput } from "@sanity/ui";
import { add, roundToNearestMinutes } from "date-fns";
import { alphabetical, isEqual } from "radash";
import { useEffect, useState } from "react";
import { ArrayOfObjectsInputProps, defineField, defineType, set } from "sanity";
import { Session } from "../../../sanity.types";
import { getSport, sportOptions } from "../sports";
import { getBlockContentType } from "./blockContentType";
import { slugUrlField } from "./slugUrlField";

const SessionsInput = (props: ArrayOfObjectsInputProps) => {
  // Make sure sessions are sorted by date
  useEffect(() => {
    // Timeout for debouncing the sorting operation
    const timeout = setTimeout(() => {
      const sessions = props.value as unknown as Session[];
      const sortedByDate = alphabetical(
        sessions,
        (session) => session.startsAt ?? "N/A",
      );
      if (isEqual(sortedByDate, sessions)) return;
      props.onChange(set(sortedByDate));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [props]);

  return (
    <>
      {props.renderDefault(props)}
      <AddMultipleSessions {...props} />
    </>
  );
};

const AddMultipleSessions = (props: ArrayOfObjectsInputProps) => {
  const [value, setValue] = useState(7);

  const sessions = props.value as unknown as Session[];
  const lastSession = sessions?.at(-1);

  if (!lastSession) return null;

  const nextSession =
    (lastSession?.startsAt &&
      ({
        startsAt: add(new Date(lastSession.startsAt), {
          days: value,
        }).toISOString(),
        duration: lastSession.duration,
        _type: "session",
        _key: crypto.randomUUID(),
      } satisfies Session & { _key: string })) ||
    undefined;

  const handleAddSession = () => {
    if (!nextSession) return;
    props.onChange(set([...sessions, nextSession]));
  };

  return (
    <Flex gap={2} align="center">
      <Text size={1}>Legg til ny sesjon</Text>
      <TextInput
        style={{ width: "3rem" }}
        pattern="\d*"
        value={value}
        onChange={(e) => setValue(Number(e.currentTarget.value) || 0)}
      />
      <Text size={1}>dager senere</Text>
      <Button
        onClick={handleAddSession}
        text={`Legg til ${nextSession?.startsAt ? formatNorwegianDate(nextSession.startsAt, "PPP p") : ""}`}
      />
    </Flex>
  );
};

export const sessionSeries = defineType({
  name: "sessionSeries",
  title: "Gjenntagende aktivitet",
  type: "document",
  icon: () => "🏋️‍♀️",
  fields: [
    defineField({
      name: "title",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sport",
      title: "Idrett",
      description:
        "Grupperer aktiviteten på «Faste aktiviteter» og vises som kategori på aktivitetssiden.",
      type: "string",
      options: { list: sportOptions },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sessions",
      title: "Sesjoner",
      type: "array",
      of: [{ type: "session" }],
      components: {
        input: SessionsInput,
      },
    }),
    getBlockContentType({ headings: ["h2"] }),
    defineField({
      name: "organizers",
      title: "Arrangør(er)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "person" }, { type: "club" }] }],
    }),
    defineField({
      name: "location",
      title: "Sted",
      type: "reference",
      to: [{ type: "location" }],
    }),
    defineField({
      type: "paymentInfo",
      title: "Betalingsinformasjon",
      name: "paymentInfo",
    }),
    {
      name: "images",
      title: "Bilder",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    },
    defineField({
      name: "slug",
      title: "Url-segment",
      description: "Feks «fotball» eller «mandagsgym»",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((slug) => {
          if (!slug?.current) return true;
          if (slug.current.match(/\s/g))
            return "Url-segment kan ikke inneholde mellomrom";
          const illegalChars = slug.current.match(/[^\w-]/g);
          if (illegalChars)
            return `Kan ikke inneholde spesialtegn: ${illegalChars.map((it) => `"${it}"`).join(", ")}`;
          return true;
        }),
      ],
      components: { field: slugUrlField("aktiviteter") },
    }),
  ],
  preview: {
    select: {
      title: "title",
      sport: "sport",
    },
    prepare: ({ title, sport }) => {
      const resolved = getSport(sport);
      return {
        title: title,
        subtitle: resolved?.title,
        media: () => resolved?.emoji ?? "🏋️‍♀️",
      };
    },
  },
});

export const session = defineType({
  name: "session",
  title: "Sesjon",
  type: "object",
  fields: [
    defineField({
      name: "startsAt",
      title: "Starter",
      type: "datetime",
      initialValue: roundToNearestMinutes(new Date(), {
        nearestTo: 30,
      }).toISOString(),
      validation: (Rule) => Rule.required(),
      options: {
        timeStep: 15,
      },
    }),
    defineField({
      name: "duration",
      title: "Varighet",
      description: "Varighet",
      type: "object",
      options: {
        columns: 2,
      },
      fields: [
        defineField({
          name: "hours",
          title: "Timer",
          type: "number",
          initialValue: 1,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "minutes",
          title: "Minutter",
          type: "number",
          initialValue: 0,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "cancelled",
      title: "Avlyst",
      description:
        "Huk av hvis denne sesjonen er avlyst. Det vil da vises en advarsel i aktivitetslisten.",
      type: "boolean",
    }),
    defineField({
      name: "note",
      title: "Kort notat",
      description:
        "Valgfritt notat til denne enkeltsesjonen som vises i aktivitetslisten. Maks 160 tegn.",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      startsAt: "startsAt",
      duration: "duration",
      cancelled: "cancelled",
    },
    prepare({ startsAt, duration, cancelled }) {
      const endTime = add(new Date(startsAt), {
        hours: duration.hours,
        minutes: duration.minutes,
      });
      return {
        title: formatNorwegianDate(startsAt, "PPP"),
        subtitle: cancelled
          ? "Avlyst"
          : `${formatNorwegianDate(startsAt, "E p")} - ${formatNorwegianDate(endTime, "p")}`,
        media: () => "🏋️‍♀️",
      };
    },
  },
});

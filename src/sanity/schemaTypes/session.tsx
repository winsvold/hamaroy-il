import { formatNorwegianDate } from "@/utils/date";
import { Sports, sports } from "@/utils/sports";
import { Button, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { add, roundToNearestMinutes } from "date-fns";
import { alphabetical, isEqual } from "radash";
import { useEffect, useState } from "react";
import { ArrayOfObjectsInputProps, defineField, defineType, set } from "sanity";
import { Session } from "../../../sanity.types";

const SessionsInput = (props: ArrayOfObjectsInputProps) => {
  // Make sure sessions are sorted by date
  useEffect(() => {
    const sessions = props.value as unknown as Session[];
    const sortedByDate = alphabetical(
      sessions,
      (session) => session.startsAt ?? "N/A",
    );
    if (isEqual(sortedByDate, sessions)) return;
    props.onChange(set(sortedByDate));
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

  const handleAddSession = () => {
    const sessions = props.value as unknown as Session[];
    const lastSession = sessions.at(-1);
    if (!lastSession?.startsAt) return;
    const newSession = {
      startsAt: add(new Date(lastSession.startsAt), {
        days: value,
      }).toISOString(),
      duration: lastSession.duration,
      _type: "session",
      _key: crypto.randomUUID(),
    } satisfies Session & { _key: string };
    props.onChange(set([...sessions, newSession]));
  };

  return (
    <Flex gap=".5rem" alignItems="center">
      Legg til ny sesjon
      <Input
        width="3rem"
        pattern="\d*"
        value={value}
        onChange={(e) => setValue(Number(e.currentTarget.value) || 0)}
      />
      dager senere
      <Button onClick={handleAddSession}>Legg til</Button>
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
      name: "sessions",
      title: "Sesjoner",
      type: "array",
      of: [{ type: "session" }],
      components: {
        input: SessionsInput,
      },
    }),
    defineField({
      name: "body",
      title: "Beskrivelse",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sport",
      title: "Sport",
      type: "string",
      options: {
        list: Object.entries(sports).map(([key, value]) => ({
          title: value.label,
          value: key,
        })),
      },
    }),
    defineField({
      name: "organizers",
      title: "Arrangør(er)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "person" }] }],
    }),
    defineField({
      name: "location",
      title: "Sted",
      type: "reference",
      to: [{ type: "location" }],
    }),
    defineField({
      type: "paymentInfo",
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
      validation: (Rule) => Rule.required(),
      components: {
        field: (props) => (
          <Stack>
            {props.renderDefault(props)}
            <Text
              fontSize="xs"
              color="gray.600"
            >{`URL: https://hamaroyil.no/aktiviteter/${props.value?.current ?? "din-verdi-her"}`}</Text>
          </Stack>
        ),
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      sport: "sport",
    },
    prepare: ({ title, sport }) => ({
      title: title,
      media: () => sports[sport as Sports]?.icon,
    }),
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
  ],
  preview: {
    select: {
      startsAt: "startsAt",
      duration: "duration",
    },
    prepare({ startsAt, duration }) {
      const endTime = add(new Date(startsAt), {
        hours: duration.hours,
        minutes: duration.minutes,
      });
      return {
        title: formatNorwegianDate(startsAt, "PPP"),
        subtitle: `${formatNorwegianDate(startsAt, "E p")} - ${formatNorwegianDate(endTime, "p")}`,
        media: () => "🏋️‍♀️",
      };
    },
  },
});

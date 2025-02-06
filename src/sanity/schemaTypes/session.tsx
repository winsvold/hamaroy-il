import { Sports, sports } from "@/utils/sports";
import roundToNearestMinutes from "date-fns/roundToNearestMinutes";
import format from "date-fns/format";
import nb from "date-fns/locale/nb";
import { defineField, defineType } from "sanity";
import { add } from "date-fns";

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
    }),
    defineField({
      name: "description",
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
        title: format(new Date(startsAt), "PPP", { locale: nb }),
        subtitle: `${format(new Date(startsAt), "p")} - ${format(new Date(endTime), "p")}`,
        media: () => "🏋️‍♀️",
      };
    },
  },
});

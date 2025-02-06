import { Sports, sports } from "@/utils/sports";
import { defineType, defineField } from "sanity";

export const sessionSeries = defineType({
  name: "sessionSeries",
  title: "Gjenntagende aktivitet",
  type: "document",
  icon: () => "🔄",
  fields: [
    defineField({
      name: "title",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startsAt",
      title: "Starttid",
      description: "Format: HH:MM, feks 10:30",
      type: "string",
      validation: (Rule) => Rule.required().regex(/^\d{2}:\d{2}$/),
      hidden: ({ parent }) => parent?.repeated,
    }),
    defineField({
      name: "endsAt",
      title: "Sluttid",
      description: "Format: HH:MM, feks 10:30",
      type: "string",
      validation: (Rule) => Rule.required().regex(/^\d{2}:\d{2}$/),
      hidden: ({ parent }) => parent?.repeated,
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
  ],
  preview: {
    select: {
      title: "title",
      sport: "sport",
    },
    prepare({ title, sport }) {
      return {
        title: title,
        media: () => sports[sport as Sports]?.icon,
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
      name: "date",
      title: "Dato",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      date: "date",
    },
    prepare({ date }) {
      return {
        title: new Date(date).toLocaleDateString("nb-NO"),
        subtitle: new Date(date).toLocaleTimeString("nb-NO"),
      };
    },
  },
});

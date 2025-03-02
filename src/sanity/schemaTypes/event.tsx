import { defineField, defineType } from "sanity";
import { getBlockContentType } from "./blockContentType";

export const event = defineType({
  name: "event",
  title: "Arrangement",
  type: "document",
  icon: () => "📅",
  fields: [
    defineField({
      name: "title",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    getBlockContentType({ headings: ["h2"] }),
    defineField({
      name: "startsAt",
      title: "Starttid",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endsAt",
      title: "Sluttid",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Sted",
      type: "reference",
      to: [{ type: "location" }],
    }),
    defineField({
      name: "organizers",
      title: "Arrangør(er)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "person" }] }],
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
  ],
});

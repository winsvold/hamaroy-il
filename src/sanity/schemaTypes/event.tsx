import { defineField, defineType } from "sanity";
import { sportOptions } from "../sports";
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
    defineField({
      name: "sport",
      title: "Idrett",
      description:
        "Bestemmer ikon og farge i aktivitetslista. Gjettes ut fra navnet hvis den står tom.",
      type: "string",
      options: { list: sportOptions },
    }),
    getBlockContentType({ headings: ["h2"] }),
    defineField({
      name: "startsAt",
      title: "Starttid",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      options: {
        timeStep: 15,
      },
    }),
    defineField({
      name: "endsAt",
      title: "Sluttid",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      options: {
        timeStep: 15,
      },
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
      of: [{ type: "reference", to: [{ type: "person" }, { type: "club" }] }],
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

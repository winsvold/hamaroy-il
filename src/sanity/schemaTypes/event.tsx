import { defineField, defineType } from "sanity";

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
    }),
    defineField({
      name: "body",
      title: "Beskrivelse",
      type: "blockContent",
    }),
    defineField({
      name: "startsAt",
      title: "Starttid",
      type: "datetime",
    }),
    defineField({
      name: "endsAt",
      title: "Sluttid",
      type: "datetime",
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

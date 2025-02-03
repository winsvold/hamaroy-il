import { defineType, defineField } from "sanity";

export const event = defineType({
  name: "event",
  title: "Arrangement",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Navn",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "blockContent",
    }),
    defineField({
      name: "startsAt",
      title: "Starttid",
      type: "datetime",
      hidden: ({ parent }) => parent?.repeated,
    }),
    defineField({
      name: "endsAt",
      title: "Sluttid",
      type: "datetime",
      hidden: ({ parent }) => parent?.repeated,
    }),
  ],
});

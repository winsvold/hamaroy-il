import { defineType } from "sanity";

export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: () => "🙋‍♂️",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "email",
      title: "Email",
      type: "email",
    },
    {
      name: "phone",
      title: "Phone",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});

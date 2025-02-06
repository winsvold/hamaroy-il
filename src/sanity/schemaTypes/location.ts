import { defineType } from "sanity";

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  icon: () => "📍",
  fields: [
    {
      name: "title",
      title: "Title",
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
    {
      name: "parent",
      title: "Ligger inni en annen lokasjon",
      type: "reference",
      to: [{ type: "location" }],
    },
    {
      name: "address",
      title: "Address",
      type: "string",
      hidden: ({ parent }) => !!parent?.parent,
    },
    {
      name: "zip",
      title: "Postkode",
      type: "string",
      hidden: ({ parent }) => !!parent?.parent,
    },
    {
      name: "city",
      title: "City",
      type: "string",
      hidden: ({ parent }) => !!parent?.parent,
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "address",
    },
  },
});

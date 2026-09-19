import { defineField, defineType } from "sanity";
import { getBlockContentType } from "./blockContentType";
import { slugUrlField } from "./slugUrlField";

export const location = defineType({
  name: "location",
  title: "Lokasjon",
  type: "document",
  icon: () => "📍",
  fields: [
    {
      name: "name",
      title: "Navn",
      type: "string",
    },
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
    getBlockContentType({ headings: ["h2"] }),
    defineField({
      name: "slug",
      title: "Url-segment",
      description: "Feks «klatrehall» eller «skateparken»",
      type: "slug",
      options: {
        source: "name",
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
      components: { field: slugUrlField("lokaler") },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "address",
    },
  },
});

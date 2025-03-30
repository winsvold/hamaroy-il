import { defineField, defineType } from "sanity";
import { getBlockContentType } from "./blockContentType";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Nettstedinnstillinger",
  type: "document",
  icon: () => "⚙️",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    {
      ...getBlockContentType({ headings: ["h2"] }),
      name: "intro",
      title: "Introduksjon",
    },
  ],
  preview: {
    prepare: () => ({
      title: "Nettstedinnstillinger",
    }),
  },
});

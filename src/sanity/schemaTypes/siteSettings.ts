import { defineField, defineType } from "sanity";

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
  ],
});

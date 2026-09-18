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
    defineField({
      name: "heroText",
      title: "Ingress på forsiden",
      description: "Én til to setninger under overskriften. Maks 200 tegn.",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "footerText",
      title: "Om laget (bunntekst)",
      description: "Kort beskrivelse av idrettslaget nederst på alle sider.",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    {
      ...getBlockContentType({ headings: ["h2"] }),
      name: "intro",
      title: "Introduksjon",
      description:
        "Velkomstteksten i det hvite feltet øverst på forsiden. Start med en overskrift — den blir feltets tittel.",
    },
    defineField({
      name: "contactEmail",
      title: "Kontakt-e-post",
      type: "email",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Nettstedinnstillinger",
    }),
  },
});

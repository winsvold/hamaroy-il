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
      name: "heroTitle",
      title: "Overskrift på forsiden",
      description: "Står den tom blir det «Velkommen til Hamarøy IL».",
      type: "string",
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
    defineField({
      name: "contactEmail",
      title: "Kontakt-e-post",
      type: "email",
    }),
    {
      ...getBlockContentType({ headings: ["h2"] }),
      name: "intro",
      title: "Introduksjon (utgår)",
      description:
        "Erstattet av «Beskjed»-dokumenter. Teksten vises fortsatt på forsiden så lenge det ikke finnes noen beskjeder — flytt den over til en beskjed og tøm så dette feltet.",
    },
  ],
  preview: {
    prepare: () => ({
      title: "Nettstedinnstillinger",
    }),
  },
});

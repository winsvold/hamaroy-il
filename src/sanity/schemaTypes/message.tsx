import { formatNorwegianDate } from "@/utils/date";
import { defineField, defineType } from "sanity";
import { getBlockContentType } from "./blockContentType";

export const message = defineType({
  name: "message",
  title: "Beskjed",
  type: "document",
  icon: () => "📣",
  fields: [
    defineField({
      name: "label",
      title: "Merkelapp",
      description:
        "Kort stikkord over beskjeden, feks «Sommer 2026» eller «Medlemskap».",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    }),
    {
      ...getBlockContentType({}),
      title: "Beskjed",
      description:
        "Selve teksten. Du kan lenke til påmelding, infosider og lignende.",
      validation: (Rule) => Rule.required(),
    },
    defineField({
      name: "publishedAt",
      title: "Publisert",
      description: "Nyeste beskjed vises øverst og framhevet på forsiden.",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "expiresAt",
      title: "Skjules etter",
      description:
        "Valgfritt. Beskjeden forsvinner automatisk fra forsiden etter dette tidspunktet.",
      type: "datetime",
    }),
  ],
  orderings: [
    {
      name: "publishedAtDesc",
      title: "Nyeste først",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "label",
      publishedAt: "publishedAt",
      expiresAt: "expiresAt",
    },
    prepare: ({ title, publishedAt, expiresAt }) => {
      const expired = expiresAt && new Date(expiresAt) < new Date();
      return {
        title,
        subtitle: [
          publishedAt && formatNorwegianDate(publishedAt, "PPP"),
          expired && "Utløpt",
        ]
          .filter(Boolean)
          .join(" · "),
        media: () => "📣",
      };
    },
  },
});

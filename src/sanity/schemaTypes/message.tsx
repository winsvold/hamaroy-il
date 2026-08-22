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
    defineField({
      name: "showInBanner",
      title: "Vis i toppbanneret",
      description:
        "Legger en oransje stripe øverst på alle sider. Bruk den til én ting om gangen.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "bannerText",
      title: "Tekst i toppbanneret",
      description:
        "Kort versjon til stripa — selve beskjeden står uansett i sin helhet lenger ned på forsiden.",
      type: "string",
      hidden: ({ parent }) => !parent?.showInBanner,
      validation: (Rule) => [
        Rule.max(140),
        Rule.custom((value, context) => {
          const parent = context.parent as
            | { showInBanner?: boolean }
            | undefined;
          if (parent?.showInBanner && !value?.trim())
            return "Fyll inn en kort tekst når beskjeden skal vises i toppbanneret";
          return true;
        }),
      ],
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
      showInBanner: "showInBanner",
    },
    prepare: ({ title, publishedAt, expiresAt, showInBanner }) => {
      const expired = expiresAt && new Date(expiresAt) < new Date();
      return {
        title,
        subtitle: [
          publishedAt && formatNorwegianDate(publishedAt, "PPP"),
          expired && "Utløpt",
        ]
          .filter(Boolean)
          .join(" · "),
        media: () => (showInBanner ? "📢" : "📣"),
      };
    },
  },
});

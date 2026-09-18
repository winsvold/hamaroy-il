import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";
import { footerPlacements, menuPlacements } from "../menuPlacements";
import { getBlockContentType } from "./blockContentType";
import { slugUrlField } from "./slugUrlField";

export const InfoPageIcon = () => "ℹ️";

export const infoPage = defineType({
  name: "infoPage",
  title: "Infoside",
  type: "document",
  icon: InfoPageIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
    }),
    defineField({
      name: "menuPlacement",
      title: "Plassering i menyen",
      type: "string",
      options: { list: [...menuPlacements], layout: "radio" },
      initialValue: "sekundaermeny",
    }),
    defineField({
      name: "footerPlacement",
      title: "Plassering i bunnteksten",
      description:
        "Siden kan stå både i menyen og i bunnteksten — «Bli medlem» hører gjerne hjemme begge steder.",
      type: "string",
      options: { list: [...footerPlacements], layout: "radio" },
      initialValue: "ingen",
    }),
    orderRankField({ type: "infoPage" }),
    getBlockContentType({ headings: ["h2"] }),
    defineField({
      name: "slug",
      title: "Url-segment",
      description: "Feks «fotball» eller «mandagsgym»",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((slug) => {
          if (!slug?.current) return true;
          if (slug.current.match(/\s/))
            return "Url-segment kan ikke inneholde mellomrom";
          return true;
        }),
      ],
      components: { field: slugUrlField("info") },
    }),
  ],
});

import { Stack, Text } from "@chakra-ui/react";
import { defineField, defineType } from "sanity";
import { menuPlacements } from "../menuPlacements";
import { getBlockContentType } from "./blockContentType";

export const infoPage = defineType({
  name: "infoPage",
  title: "Infoside",
  type: "document",
  icon: () => "ℹ️",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
    }),
    defineField({
      name: "menuPlacement",
      title: "Hvor skal siden lenkes opp?",
      description:
        "Siden kan stå flere steder samtidig — «Bli medlem» hører gjerne hjemme både som toppknapp og i bunnteksten. Uten valg her havner siden i menyen, etter klubbene.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [...menuPlacements],
        layout: "grid",
      },
    }),
    defineField({
      name: "order",
      title: "Sortering",
      description:
        "Lavest tall kommer først i menyen. Sider med likt tall sorteres alfabetisk.",
      type: "number",
      initialValue: 0,
    }),
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
      components: {
        field: (props) => (
          <Stack>
            {props.renderDefault(props)}
            <Text
              fontSize="xs"
              color="gray.600"
            >{`URL: https://hamaroyil.no/info/${props.value?.current ?? "din-verdi-her"}`}</Text>
          </Stack>
        ),
      },
    }),
  ],
});

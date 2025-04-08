import { Stack, Text } from "@chakra-ui/react";
import { defineField, defineType } from "sanity";
import { getBlockContentType } from "./blockContentType";

export const club = defineType({
  name: "club",
  title: "Klubb",
  type: "document",
  icon: () => "🏢",
  fields: [
    {
      name: "name",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
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
    defineField({
      name: "managers",
      title: "Ledere",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "person",
              title: "Person",
              type: "reference",
              to: [{ type: "person" }],
            }),
            defineField({
              name: "role",
              title: "Rolle",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "person.name",
              subtitle: "role",
              media: "person.image",
            },
          },
        },
      ],
    }),
    getBlockContentType({ headings: ["h2"] }),
    defineField({
      name: "slug",
      title: "Url-segment",
      description: "Feks «klatreklubben» eller «fotballklubben»",
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
      components: {
        field: (props) => (
          <Stack>
            {props.renderDefault(props)}
            <Text
              fontSize="xs"
              color="gray.600"
            >{`URL: https://hamaroyil.no/klubb/${props.value?.current ?? "din-verdi-her"}`}</Text>
          </Stack>
        ),
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "address",
    },
  },
});

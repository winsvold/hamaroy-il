import { Stack, Text } from "@chakra-ui/react";
import { defineField, defineType } from "sanity";

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
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "blockContent",
    }),
    defineField({
      name: "slug",
      title: "Url-segment",
      description: "Feks «klatrehall» eller «skateparken»",
      type: "slug",
      options: {
        source: "name",
      },
      validation: (Rule) => Rule.required(),
      components: {
        field: (props) => (
          <Stack>
            {props.renderDefault(props)}
            <Text
              fontSize="xs"
              color="gray.600"
            >{`URL: https://hamaroyil.no/lokaler/${props.value?.current ?? "din-verdi-her"}`}</Text>
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

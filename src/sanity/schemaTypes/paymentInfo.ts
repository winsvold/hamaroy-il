import { defineField, defineType } from "sanity";

export const paymentInfo = defineType({
  name: "paymentInfo",
  title: "Betalingsinformasjon",
  type: "object",
  fields: [
    defineField({
      name: "vippsNumber",
      title: "Vippsnummer",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Detaljer",
      type: "blockContent",
    }),
  ],
});

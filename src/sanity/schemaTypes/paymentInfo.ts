import { defineField, defineType } from "sanity";
import { getBlockContentType } from "./blockContentType";

export const paymentInfo = defineType({
  name: "paymentInfo",
  title: "Betalingsinformasjon",
  type: "object",
  fields: [
    getBlockContentType({}),
    defineField({
      name: "vippsNumber",
      title: "Vippsnummer",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "Url til betaling",
      type: "url",
    }),
  ],
});

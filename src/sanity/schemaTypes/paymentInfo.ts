import { defineField, defineType } from "sanity";
import { getBlockContentType } from "./blockContentType";

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
    getBlockContentType({}),
  ],
});

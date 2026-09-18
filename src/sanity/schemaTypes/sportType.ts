import { defineType } from "sanity";
import { sportOptions } from "../sports";

export const sport = defineType({
  name: "sport",
  title: "Idrett",
  type: "string",
  options: { list: sportOptions },
});

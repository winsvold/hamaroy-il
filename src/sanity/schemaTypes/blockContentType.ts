import { sift } from "radash";
import { defineArrayMember, defineField } from "sanity";

type Options = {
  headings?: "h2"[];
};

export const getBlockContentType = (options: Options) =>
  defineField({
    title: "Fritekst",
    name: "body",
    type: "array",
    of: [
      defineArrayMember({
        type: "block",
        styles: sift([
          { title: "Normal", value: "normal" },
          options.headings?.includes("h2") && {
            title: "Overskrift",
            value: "h2",
          },
        ]),
        lists: sift([
          { title: "Bullet", value: "bullet" },
          { title: "Number", value: "number" },
        ]),
        // Marks let you mark up inline text in the Portable Text Editor
        marks: {
          decorators: [],
          annotations: [
            {
              title: "URL",
              name: "link",
              type: "object",
              fields: [
                {
                  title: "URL",
                  name: "href",
                  type: "url",
                },
              ],
            },
          ],
        },
      }),
      // defineArrayMember({
      //   type: "image",
      //   icon: ImageIcon,
      //   options: { hotspot: true },
      //   fields: [
      //     {
      //       name: "alt",
      //       type: "string",
      //       title: "Alternative Text",
      //     },
      //   ],
      // }),
    ],
  });

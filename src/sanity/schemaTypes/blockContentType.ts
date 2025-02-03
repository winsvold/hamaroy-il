import { defineType, defineArrayMember } from "sanity";

export const blockContentType = defineType({
  title: "Riktekst",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Overskrift", value: "h2" },
      ],
      lists: [{ title: "Bullet", value: "bullet" }],
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
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

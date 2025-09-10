import { TagIcon } from "lucide-react";
import { defineType, defineField } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "range",
      type: "number",
      description: "Starting from",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "statueType",
      title: "Type of Statue",
      type: "string",
      options: {
        list: [
          { title: "Vinayagar", value: "vinayagar" },
          { title: "Lakshmi", value: "lakshmi" },
          { title: "Saraswathi", value: "saraswathi" },
          { title: "Perumal", value: "perumal" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});

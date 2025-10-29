  import { TagIcon } from "lucide-react";
  import { defineType, defineField } from "sanity";

  export const categoryType = defineType({
    name: "category",
    title: "Category",
    type: "document",
    icon: TagIcon,

    fields: [
      // 🟢 Main Category Title
      defineField({
        name: "title",
        title: "Category Title",
        type: "string",
        validation: (Rule) => Rule.required().error("Category title is required"),
      }),

      // 🟢 Slug for Main Category
      defineField({
        name: "slug",
        title: "Slug",
        type: "slug",
        options: { source: "title", maxLength: 96 },
        validation: (Rule) => Rule.required().error("Slug is required"),
      }),

      // 🟢 Description
      defineField({
        name: "description",
        title: "Description",
        type: "text",
        description: "Short description of this category",
      }),

      // 🟢 Image
      defineField({
        name: "image",
        title: "Category Image",
        type: "image",
        options: { hotspot: true },
      }),

      // 🟣 Subcategories
      defineField({
        name: "subCategories",
        title: "Sub Categories",
        type: "array",
        of: [
          {
            type: "object",
            name: "subCategory",
            title: "Sub Category",
            fields: [
              defineField({
                name: "title",
                title: "Subcategory Title",
                type: "string",
                validation: (Rule) =>
                  Rule.required().error("Subcategory title is required"),
              }),
              defineField({
                name: "slug",
                title: "Subcategory Slug",
                type: "slug",
                options: { source: "title", maxLength: 96 },
                validation: (Rule) =>
                  Rule.required().error("Subcategory slug is required"),
              }),
              defineField({
                name: "description",
                title: "Subcategory Description",
                type: "text",
              }),
              defineField({
                name: "image",
                title: "Subcategory Image",
                type: "image",
                options: { hotspot: true },
              }),
            ],
            preview: {
              select: {
                title: "title",
                subtitle: "slug.current",
                media: "image",
              },
            },
          },
        ],
        description: "Add one or more subcategories under this category",
      }),
    ],

    preview: {
      select: {
        title: "title",
        subtitle: "description",
        media: "image",
      },
      prepare({ title, subtitle, media }) {
        return {
          title,
          subtitle: subtitle || "No description available",
          media,
        };
      },
    },
  });
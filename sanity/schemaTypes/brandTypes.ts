import { TagIcon } from "lucide-react"; // Correct import for icon
import { defineField, defineType } from "sanity";

export const brandType = defineType({
    name: "brand",
    title: "Brand",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "title",
            type: "string",
            validation: Rule => Rule.required().error("Title is required"),
        }),
        defineField({
            name: "slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: Rule => Rule.required().error("Slug is required"),
        }),
        defineField({
            name: "description",
            type: "text",
        }),
        defineField({
            name: "image",
            title: "Brand Image",
            type: "image",
            options: {
                hotspot: true,
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

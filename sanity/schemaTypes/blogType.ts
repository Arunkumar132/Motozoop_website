import { FileTextIcon } from "lucide-react"; // Use a valid icon
import { defineArrayMember, defineField, defineType } from "sanity";

export const blogType = defineType({
    name: "blog",
    title: "Blog",
    type: "document",
    icon: FileTextIcon, // Correct icon reference
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
            name: "author",
            type: "reference",
            to: { type: "author" },
            validation: Rule => Rule.required().error("Author is required"),
        }),
        defineField({
            name: "mainImage",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "blogcategories",
            type: "array",
            of: [
                defineArrayMember({
                    type: "reference",
                    to: { type: "blogcategory" },
                }),
            ],
        }),
        defineField({
            name: "publishedAt",
            type: "datetime",
            validation: Rule => Rule.required().error("Published date is required"),
        }),
        defineField({
            name: "isLatest",
            title: "Latest Blog",
            type: "boolean",
            description: "Toggle to mark as Latest or not",
            initialValue: true,
        }),
        defineField({
            name: "body",
            type: "blockContent",
        }),
    ],
    preview: {
        select: {
            title: "title",
            author: "author.name",
            media: "mainImage",
            isLatest: "isLatest",
        },
        prepare(selection) {
            const { author, isLatest } = selection;
            return {
                ...selection,
                subtitle: author ? `${isLatest ? "Latest | " : ""}By ${author}` : "",
            };
        },
    },
});

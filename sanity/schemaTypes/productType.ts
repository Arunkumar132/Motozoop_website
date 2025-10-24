import { ShoppingCartIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: ShoppingCartIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: Rule =>
        Rule.required().error("Product name is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: Rule =>
        Rule.required().error("Slug is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: Rule =>
        Rule.required().min(0).error("Price must be at least 0"),
    }),
    defineField({
      name: "discount",
      title: "Discount Percentage",
      type: "number",
      validation: Rule =>
        Rule.required().min(0).error("Discount must be at least 0"),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: { type: "brand" },
    }),
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "varient",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Dashboard", value: "dashboard_accesories" },
          { title: "Interior", value: "interior" },
          { title: "Exterior", value: "exterior" },
          { title: "Detailing", value: "detailing" },
          { title: "Car Care Products", value: "car_care_products" },
        ],
      },
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to featured on or off",
      initialValue: false,
    }),

    // Colors with multiple images and individual stock
    defineField({
      name: "colors",
      title: "Available Colors",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "colorName",
              title: "Color Name",
              type: "string",
              description: "Enter color name or hex code",
            }),
            defineField({
              name: "images",
              title: "Color Images",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              description: "Upload multiple images for this color",
            }),
            defineField({
              name: "stock",
              title: "Stock for this Color",
              type: "number",
              validation: Rule =>
                Rule.required().min(0).error("Stock cannot be negative"),
            }),
          ],
          preview: {
            select: {
              title: "colorName",
              media: "images.0",
              stock: "stock",
            },
            prepare(selection) {
              const { title, media, stock } = selection;
              return {
                title: `${title} (${stock} available)`,
                media,
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: "statues",
      title: "Statues",
      type: "array",
      of: [{ type: "string" }],
      description: "Add multiple statue values (optional)",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "price",
      media: "colors.0.images.0",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title,
        subtitle: subtitle !== undefined ? `₹${subtitle}` : "",
        media,
      };
    },
  },
});

export const productTabs = [
  { title: "Dashboard", value: "dashboard_accesories" },
  { title: "Interior", value: "interior" },
  { title: "Exterior", value: "exterior" },
  { title: "Detailing", value: "detailing" },
  { title: "Car Care Products", value: "car_care_products" },
];

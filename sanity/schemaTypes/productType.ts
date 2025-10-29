import { ShoppingCartIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import { SubCategorySelect } from "./SubCategorySelect";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: ShoppingCartIcon,

  fields: [
    // 🟢 Basic Info
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required().error("Product name is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required().error("Slug is required"),
    }),
    defineField({ name: "description", title: "Description", type: "string" }),
    defineField({ name: "overview", title: "Overview", type: "text" }),

    // 🟢 Pricing
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) =>
        Rule.required().min(0).error("Price must be at least 0"),
    }),
    defineField({
      name: "discount",
      title: "Discount Percentage",
      type: "number",
      validation: (Rule) =>
        Rule.required().min(0).error("Discount must be at least 0"),
    }),

    // 🟢 Category Reference
    defineField({
      name: "category",
      title: "Main Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required().error("Category is required"),
    }),

    // 🟣 Subcategory with Custom Dropdown Component
    defineField({
      name: "subCategory",
      title: "Sub Category",
      type: "string",
      description: "Select a subcategory from the chosen main category",
      components: {
        input: SubCategorySelect,
      },
    }),

    // 🟢 Brand Reference
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
    }),

    // 🟢 Product Status
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

    // 🟢 Product Type
    defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Dashboard Accessories", value: "dashboard_accessories" },
          { title: "Interior", value: "interior" },
          { title: "Exterior", value: "exterior" },
          { title: "Detailing", value: "detailing" },
          { title: "Car Care Products", value: "car_care_products" },
        ],
      },
    }),

    // 🟢 Featured Toggle
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle ON to feature this product",
      initialValue: false,
    }),

    // 🟣 Colors with Stock and Images
    defineField({
      name: "colors",
      title: "Available Colors",
      type: "array",
      of: [
        {
          type: "object",
          title: "Color Option",
          fields: [
            defineField({
              name: "colorName",
              title: "Color Name",
              type: "string",
              validation: (Rule) =>
                Rule.required().error("Color name is required"),
            }),
            defineField({
              name: "images",
              title: "Color Images",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
            }),
            defineField({
              name: "stock",
              title: "Stock for this Color",
              type: "number",
              validation: (Rule) =>
                Rule.required().min(0).error("Stock cannot be negative"),
            }),
          ],
          preview: {
            select: { title: "colorName", stock: "stock", media: "images.0" },
            prepare({ title, stock, media }) {
              return { title: `${title} (${stock} available)`, media };
            },
          },
        },
      ],
    }),

    // 🟢 Optional Statues Field
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
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle ? `₹${subtitle}` : "", media };
    },
  },
});

// 🟢 Tabs for frontend filtering
export const productTabs = [
  { title: "Interior Accessories", value: "interior" },
  { title: "Exterior Accessories", value: "exterior" },
  { title: "Car Care Products", value: "car_care_products" },
];
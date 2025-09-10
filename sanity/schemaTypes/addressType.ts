import { HomeIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const addressType = defineType({
  name: "address",
  title: "Addresses",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Address Name",
      type: "string",
      description: "A friendly name for this address (e.g., Home, Work)",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "email",
      title: "User Email",
      type: "email",
    }),
    defineField({
      name: "address",
      title: "Street Address",
      type: "string",
      description: "The street address, including house number and street name",
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      description: "Two letter state code (e.g., CA for California)",
      validation: (Rule) => Rule.required().length(2).uppercase(),
    }),
    defineField({
      name: "zipCode",
      title: "ZIP Code",
      type: "string",
      description: "5 or 9 digit ZIP code",
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{5}(-\d{4})?$/, {
            name: "zipCode",
            invert: false,
          })
          .custom((zip: string | undefined) => {
            if (!zip) {
              return "ZIP code is required";
            }
            if (!zip.match(/^\d{5}(-\d{4})?$/)) {
              return "Please enter a valid ZIP code";
            }
            return true;
          }),
    }),
    defineField({
      name: "default",
      title: "Default Address",
      type: "boolean",
      description: "Is this the default shipping address?",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      // Use defaultValue instead of initialValue if needed
      // defaultValue: new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "address",
      city: "city",
      state: "state",
      isDefault: "default",
    },
    prepare({ title, subtitle, city, state, isDefault }) {
      return {
        title: isDefault ? `${title} (Default)` : title,
        subtitle: `${subtitle}, ${city}, ${state}`,
      };
    },
  },
});

// schemaTypes/franchiseEnquiry.ts
import { FileTextIcon } from "lucide-react";
import { defineType, defineField } from "sanity";

export const franchiseEnquiryType = defineType({
  name: "franchiseEnquiry",
  title: "Franchise Enquiries",
  type: "document",
  icon: FileTextIcon,
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
    }),
    defineField({
      name: "occupation",
      title: "Occupation",
      type: "string",
    }),
    defineField({
      name: "investment",
      title: "Investment Capacity",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["Pending", "Reviewed", "Contacted"],
      },
      initialValue: "Pending",
    }),
  ],
  preview: {
    select: {
      title: "fullName",
      subtitle: "email",
      status: "status",
      createdAt: "createdAt",
    },
    prepare(selection) {
      const { title, subtitle, status, createdAt } = selection;
      return {
        title,
        subtitle: `${subtitle} | ${status} | ${new Date(createdAt).toLocaleDateString()}`,
      };
    },
  },
});

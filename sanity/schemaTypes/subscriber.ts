import { defineType, defineField } from "sanity";

export default defineType({
  name: "subscriber",
  title: "Subscribers",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "createdAt",
      title: "Subscribed On",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
});

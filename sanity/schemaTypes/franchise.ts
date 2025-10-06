import { HomeIcon } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const franchise =  defineType({
  name: 'franchise',
  title: 'Franchise',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),

    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Include country code if applicable (e.g. +91...)',
      validation: (Rule) =>
        Rule.required()
          .min(7)
          .max(20)
          .regex(/^[0-9+\-()\s]+$/, {
            name: 'phone',
            invert: false,
          }),
    }),

    defineField({
      name: 'preferredLocation',
      title: 'Preferred Location',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(200),
    }),

    defineField({
      name: 'investmentCapacity',
      title: 'Investment Capacity',
      type: 'number',
      description: 'Enter the approximate investment capacity (numbers only). You can store the currency conventionally (e.g. INR).',
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: 'message',
      title: 'Message / Additional Details',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(2000),
    }),

    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      options: { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' },
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'preferredLocation',
      media: 'submittedAt',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || 'Untitled enquiry',
        subtitle: subtitle ? `Location: ${subtitle}` : 'No preferred location',
      };
    },
  },
});

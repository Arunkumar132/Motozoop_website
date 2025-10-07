import { BracketsIcon } from "lucide-react"; // Correct icon import
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BracketsIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "invoice",
      title: "Invoice",
      type: "object",
      fields: [
        defineField({ name: "id", title: "ID", type: "string" }),
        defineField({ name: "number", title: "Number", type: "string" }),
        defineField({ name: "hosted_invoice_url", title: "Hosted Invoice URL", type: "url" }),
      ],
    }),
    defineField({
      name: "razorpayOrderId",
      title: "Razorpay Order ID",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "razorpayPaymentId",
      title: "Razorpay Payment ID",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "razorpaySignature",
      title: "Razorpay Signature",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "Store User ID",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
              validation: Rule => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.images",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(selection) {
              const { product, quantity, image, price, currency } = selection;
              const img = Array.isArray(image) && image.length > 0 ? image[0] : undefined;
              const total = price && quantity ? price * quantity : 0;
              return {
                title: `${product} x ${quantity}`,
                subtitle: `${total} ${currency || ""}`,
                media: img,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Delivery Address",
      type: "object",
      fields: [
        defineField({ name: "state", title: "State", type: "string" }),
        defineField({ name: "zip", title: "Zip Code", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "address", title: "Address", type: "string" }),
        defineField({ name: "name", title: "Name", type: "string" }),
      ],
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Paid", value: "paid" },
          { title: "Order Confirmed", value: "order_confirmed" },
          { title: "Packing", value: "packing" },
          { title: "Shipped", value: "shipped" },
          { title: "Out for Delivery", value: "out_for_delivery" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
      phone: "phoneNumber",
    },
    prepare(selection) {
      const { name, amount, currency, orderId, email, phone } = selection;
      const orderIdSnippet = orderId ? `${orderId.slice(0, 5)}...` : "";
      return {
        title: `${name} (${orderIdSnippet})`,
        subtitle: `${amount} ${currency || ""}, ${email || ""}, ${phone || ""}`,
        media: BracketsIcon,
      };
    },
  },
});

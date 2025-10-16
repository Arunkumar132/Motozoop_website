import client from "@/sanity/lib/client";

import { sendOrderConfirmation } from "@/lib/email";

export const createOrderAndNotify = async (orderData: any) => {
  // 1️⃣ Save the order to Sanity
  const savedOrder = await client.create(orderData);

  // 2️⃣ Send the confirmation email
  try {
    await sendOrderConfirmation(orderData.customerEmail, {
      id: savedOrder._id,
      total: orderData.total,
      items: orderData.products.map((p: any) => ({
        name: p.product.title,
        quantity: p.quantity,
      })),
    });
    console.log("Order confirmation email sent successfully.");
  } catch (err) {
    console.error("Failed to send email:", err);
  }

  return savedOrder;
};

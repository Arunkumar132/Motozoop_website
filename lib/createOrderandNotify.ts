import client from "@/sanity/lib/client";
import { sendOrderConfirmation } from "@/lib/email";

// Define proper types for product and order
interface OrderProduct {
  product: {
    title: string;
  };
  quantity: number;
}

interface OrderData {
  customerEmail: string;
  total: number;
  products: OrderProduct[];
  [key: string]: unknown; // Allow extra Sanity fields like _type, _id, etc.
}

interface SavedOrder {
  _id: string;
}

// Create order and send confirmation
export const createOrderAndNotify = async (
  orderData: OrderData
): Promise<SavedOrder> => {
  // 1️⃣ Save the order to Sanity
  const savedOrder = await client.create<SavedOrder>(orderData);

  // 2️⃣ Send the confirmation email
  try {
    await sendOrderConfirmation(orderData.customerEmail, {
      id: savedOrder._id,
      total: orderData.total,
      items: orderData.products.map((p) => ({
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

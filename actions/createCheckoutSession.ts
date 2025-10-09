"use server";

import Razorpay from "razorpay";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";

export interface Metadata {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserId?: string | number | null;
    address?: Address | null;
}

export interface GroupedCartItems {
    product: CartItem["product"];
    quantity: number;
}

export async function createCheckoutSession(
    items: GroupedCartItems[],
    metadata: Metadata,
    amount: number
) {
    try {
        // Initialize Razorpay here to ensure env vars are loaded
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const totalAmount = Math.round(amount * 100); // convert rupees → paise

        const order = await razorpay.orders.create({
            amount: totalAmount,
            currency: "INR",
            receipt: metadata.orderNumber,
            notes: {
                customerName: metadata.customerName,
                customerEmail: metadata.customerEmail,
                clerkUserId: metadata.clerkUserId?.toString() || "",
                address: JSON.stringify(metadata.address || {}),
                items: JSON.stringify(
                    items.map((item) => ({
                        name: item.product.name || "Unknown",
                        description: item.product.description || "",
                        quantity: item.quantity || 1,
                        price: item.product.price || 0,
                        image: item.product.images?.[0] ? urlFor(item.product.images[0]).url() : "",
                    }))
                ),
            },
        });

        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            customerEmail: metadata.customerEmail,
            successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderNumber=${metadata.orderNumber}`,
            cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        };
    } catch (error) {
        console.error("Error creating Razorpay order", error);
        throw error;
    }
}

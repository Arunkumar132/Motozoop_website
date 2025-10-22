"use client";

import useStore from "@/store";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Home, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { backendClient } from "@/sanity/lib/backendClient";

interface Order {
  orderNumber: string;
}

export default function SuccessPage() {
  const { resetCart } = useStore();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderNumber) {
      resetCart();

      const fetchOrder = async () => {
        try {
          const query = `*[_type == "order" && orderNumber == $orderNumber][0]{ orderNumber }`;
          const orderData = await backendClient.fetch(query, { orderNumber });
          setOrder(orderData || { orderNumber: orderNumber! });
        } catch (err) {
          console.error("Error fetching order:", err);
        }
      };

      fetchOrder();
    }
  }, [orderNumber, resetCart]);

  return (
    <div className="pt-10 pb-2 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col items-center">
      {/* Logo */}
      <div className="text-center mb-6">
        <Image
          src="/Untitled_design-removebg-preview.png"
          alt="MOTOZOOP Logo"
          width={128}
          height={128}
          className="mx-auto h-auto w-32"
          priority
        />
      </div>

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-shop_dark_green rounded-full flex items-center justify-center mb-6"
      >
        <Check className="text-white w-12 h-12" />
      </motion.div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed</h1>

      <p className="text-gray-700 text-center px-4 sm:px-0">
        Thank you for your purchase.
      </p>
      <p className="text-gray-700 text-center px-4 sm:px-0">
        We&apos;re processing your order and will ship it soon.
      </p>
      <p className="text-gray-700 text-center mb-6 px-4 sm:px-0">
        A confirmation email with your order details has been sent to your inbox.
      </p>

      <p className="text-shop_dark_green font-semibold mb-6">
        Order Number: {order?.orderNumber || orderNumber}
      </p>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md px-4 sm:px-0">
        <Link
          href="/"
          className="flex items-center justify-center px-4 py-3 font-semibold bg-shop_dark_green text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:bg-white hover:text-shop_dark_green hover:border-shop_dark_green"
        >
          <Home className="w-5 h-5 mr-2" />
          Home
        </Link>

        <Link
          href="/orders"
          className="flex items-center justify-center px-4 py-3 font-semibold bg-white text-shop_dark_green border border-shop_dark_green rounded-lg hover:bg-shop_dark_green hover:text-white transition-all duration-300"
        >
          <Package className="w-5 h-5 mr-2" />
          Orders
        </Link>

        <Link
          href="/shop"
          className="flex items-center justify-center px-4 py-3 font-semibold bg-shop_dark_green text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:bg-white hover:text-shop_dark_green hover:border-shop_dark_green"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Shop
        </Link>
      </div>
    </div>
  );
}

"use client";

import useStore from "@/store";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Home, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { backendClient } from "@/sanity/lib/backendClient";

interface Product {
  product: { _ref: string; _type: string; name?: string };
  quantity: number;
}

interface Order {
  orderNumber: string;
  customerName: string;
  totalPrice: number;
  currency: string;
  products: Product[];
}

const SuccessPage = () => {
  const { resetCart } = useStore();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderNumber) {
      resetCart();

      // Fetch order details from Sanity
      const fetchOrder = async () => {
        try {
          const query = `*[_type == "order" && orderNumber == $orderNumber][0]{
            orderNumber,
            customerName,
            totalPrice,
            currency,
            products[]{
              quantity,
              product->{
                name
              }
            }
          }`;
          const orderData = await backendClient.fetch(query, { orderNumber });
          if (orderData) setOrder(orderData);
        } catch (err) {
          console.error("Error fetching order:", err);
        }
      };
      fetchOrder();
    }
  }, [orderNumber, resetCart]);

  return (
    <div className="py-5 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl flex flex-col gap-5 shadow-2xl p-6 max-w-xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <Check className="text-white w-10 h-10" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed</h1>

        <div className="space-y-4 mb-4 text-left">
          <p className="text-gray-700">
            Thank you for your purchase. We&apos;re processing your order and will ship it soon.
            A confirmation email with your order details will be sent to your inbox shortly.
          </p>

          <p className="text-gray-700">
            Order Number:{" "}
            <span className="text-black font-semibold">{order?.orderNumber || orderNumber}</span>
          </p>

          {order?.products && order.products.length > 0 && (
            <div className="text-gray-700">
              <p className="font-semibold mt-2">Products:</p>
              <ul className="list-disc list-inside">
                {order.products.map((item, index) => (
                  <li key={index}>
                    {item.product?.name || "Product"} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-semibold">
                Total Price: {order.totalPrice} {order.currency}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-80 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>

          <Link
            href="/orders"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-lightGreen text-black border border-lightGreen rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            <Package className="w-5 h-5 mr-2" />
            Orders
          </Link>

          <Link
            href="/shop"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;

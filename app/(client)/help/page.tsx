"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-4 sm:px-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900">Need Help?</h1>
        <p className="mt-4 text-gray-600">
          We’re here to assist you with anything related to Motozoop — from orders to
          account issues. Explore below or reach out directly.
        </p>
      </motion.div>

      {/* Help Sections */}
      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
        {helpTopics.map((topic, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{topic.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{topic.content}</p>
          </motion.div>
        ))}
      </div>

      {/* Contact Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-16"
      >
        <Link
          href="/contact"
          className="inline-block bg-shop_btn_dark_green text-white px-6 py-3 rounded-full font-medium hover:bg-shop_light_green transition"
        >
          Contact Us
        </Link>
      </motion.div>
    </div>
  );
};

export default HelpPage;

const helpTopics = [
  {
    title: "Order Tracking",
    content:
      "Track your orders easily from your Motozoop dashboard. You'll receive updates via email and SMS once your package ships.",
  },
  {
    title: "Returns & Refunds",
    content:
      "We accept returns within 7 days of delivery for unused products in original packaging. Refunds are processed within 3–5 business days.",
  },
  {
    title: "Payment Issues",
    content:
      "Facing trouble during checkout or payment failure? Don’t worry — your amount will be auto-refunded within 5–7 working days.",
  },
  {
    title: "Account Assistance",
    content:
      "Forgot password or can’t access your account? Use the ‘Forgot Password’ option or contact us for secure recovery support.",
  },
  {
    title: "Shipping & Delivery",
    content:
      "We partner with reliable couriers to deliver your orders safely and on time, both domestically and internationally.",
  },
  {
    title: "Product Support",
    content:
      "Need guidance with product installation or compatibility? Our support team is happy to help you find the right fit for your vehicle.",
  },
];

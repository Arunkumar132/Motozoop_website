"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Motozoop?",
    answer:
      "Motozoop is your one-stop online destination for premium motor accessories, parts, and lifestyle products — all curated for speed and style enthusiasts.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes! We ship globally with trusted logistics partners. Shipping costs and times vary based on your location.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is placed, you’ll receive a tracking link via email and you can also view it in your Motozoop account dashboard.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Absolutely. You can return or exchange products within 7 days of delivery, as long as they are unused and in original packaging.",
  },
  {
    question: "Do you offer discounts or loyalty rewards?",
    answer:
      "Yes, registered Motozoop members get exclusive seasonal discounts, early access to drops, and loyalty points for every purchase.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-4 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <p className="mt-4 text-gray-600">
          Got questions? We’ve got answers. Find everything you need to know about Motozoop below.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center text-left p-5"
            >
              <span className="font-semibold text-gray-800">{faq.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </motion.div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: openIndex === index ? "auto" : 0,
                opacity: openIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden px-5"
            >
              <p className="text-gray-600 pb-4">{faq.answer}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
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

export default FAQPage;

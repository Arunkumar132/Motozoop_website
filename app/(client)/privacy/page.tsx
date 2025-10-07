"use client";

import React from "react";
import Container from "@/components/Container";
import { motion } from "framer-motion";
import Link from "next/link";

const PrivacyPolicyPage = () => {
  return (
    <Container>
      {/* Hero Section */}
      <section className="py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-left"
        >
          <h4 className="text-shop_light_green font-medium mb-4 uppercase tracking-wide">
            Privacy Policy
          </h4>

          <h1 className="text-xl md:text-2xl font-semibold text-shop_dark_green mb-2 leading-snug">
            Your Privacy Matters to MotoZoop
          </h1>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            At <span className="font-semibold text-shop_light_green">MotoZoop</span>, we are committed
            to protecting your privacy. This Privacy Policy outlines how we
            collect, use, and safeguard your personal information when you use
            our website and services.
          </p>
        </motion.div>
      </section>

      {/* Information We Collect */}
      <section className="py-8 bg-shop_light_bg rounded-2xl shadow-sm mt-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-left"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-shop_dark_green mb-2">
            Information We Collect
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
            We may collect information such as your name, email address,
            shipping address, and payment details when you make purchases or
            register on our site.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            We also automatically collect non-personal information such as
            browsing activity, IP addresses, and cookies to enhance your
            experience on our site.
          </p>
        </motion.div>
      </section>

      {/* How We Use Information */}
      <section className="py-8 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-left"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-shop_dark_green mb-2">
            How We Use Your Information
          </h2>
          <ul className="list-disc list-inside text-gray-700 text-base md:text-lg leading-relaxed space-y-1">
            <li>To process and fulfill your orders efficiently.</li>
            <li>To communicate updates, promotions, and special offers.</li>
            <li>To personalize your experience on our platform.</li>
            <li>To improve our website, products, and services.</li>
            <li>To ensure compliance with legal requirements and prevent fraud.</li>
          </ul>
        </motion.div>
      </section>

      {/* Security & Contact */}
      <section className="py-8 bg-shop_light_bg rounded-2xl shadow-sm mt-1 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-left"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-shop_dark_green mb-2">
            Security & Contact
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
            We implement industry-standard security measures to protect your
            data. While no online system can be completely secure, we continually
            work to safeguard your personal information.
          </p>
          <Link href="/contact">
            <button className="bg-shop_dark_green text-white px-6 py-2.5 rounded-lg hover:bg-shop_btn_dark_green transition text-sm font-medium">
              Contact Us
            </button>
          </Link>
        </motion.div>
      </section>
    </Container>
  );
};

export default PrivacyPolicyPage;

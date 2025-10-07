"use client";

import React from "react";
import Container from "@/components/Container";
import { motion } from "framer-motion";
import Link from "next/link";

const TermsPage = () => {
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
          <h4 className="text-shop_light_green font-medium mb-2 uppercase tracking-wide">
            Terms & Conditions
          </h4>

          <h1 className="text-2xl md:text-3xl font-semibold text-shop_dark_green mb-4 leading-snug">
            Terms and Conditions of Using MotoZoop
          </h1>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Welcome to <span className="font-semibold">MotoZoop</span>. By accessing or
            using our website and services, you agree to comply with and be bound
            by the following Terms and Conditions. Please read them carefully to
            understand your rights, responsibilities, and limitations while using
            our platform.
          </p>
        </motion.div>
      </section>

      {/* Use of Site */}
      <section className="py-8 bg-shop_light_bg rounded-2xl shadow-sm mt-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-left"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-shop_dark_green mb-2">
            Use of Our Site
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
            By using our website, you agree to use it solely for lawful purposes
            and in a manner that does not infringe the rights of others or restrict
            their use of the site. Unauthorized activities such as hacking,
            distributing malware, or attempting to access restricted areas are
            strictly prohibited.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            You agree not to reproduce, duplicate, or exploit any content without
            explicit permission from MotoZoop. We reserve the right to suspend or
            terminate access for users violating these terms.
          </p>
        </motion.div>
      </section>

      {/* Orders & Payments */}
      <section className="py-8 mt-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-left"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-shop_dark_green mb-2">
            Orders & Payments
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
            All orders placed through MotoZoop are subject to product availability
            and confirmation of the order price. We strive to maintain accurate
            inventory information, but in rare cases, products may be unavailable
            after your order is placed.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
            Payments must be completed in full before shipment. We accept all
            supported payment methods listed on our checkout page. In the event of
            a payment failure, your order will not be processed until the issue
            is resolved.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            By placing an order, you agree that all information provided is
            accurate and up to date. MotoZoop reserves the right to refuse or
            cancel any order due to errors, fraud, or violation of these Terms.
          </p>
        </motion.div>
      </section>

      {/* Returns & Liability */}
      <section className="py-8 bg-shop_light_bg rounded-2xl shadow-sm mt-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-left"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-shop_dark_green mb-2">
            Returns & Liability
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
            Returns and exchanges are handled according to our Return Policy. Please
            review it carefully to understand the process, conditions, and
            applicable timeframes for returning items.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
            MotoZoop is not responsible for any indirect, incidental, or
            consequential damages arising from the use or inability to use our
            products. Our maximum liability is limited to the purchase price of
            the product in question.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            We encourage users to inspect products upon receipt and report any
            issues promptly so that we can provide appropriate support and
            resolution.
          </p>
        </motion.div>
      </section>

      {/* Contact */}
      <section className="py-8 mt-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-left"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-shop_dark_green mb-3">
            Contact Us
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
            If you have any questions, concerns, or require clarification regarding
            these Terms and Conditions, our team is here to assist you. Please reach
            out to us via our Contact page for a prompt response.
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

export default TermsPage;

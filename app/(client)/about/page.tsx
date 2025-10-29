"use client";

import React from "react";
import Container from "@/components/Container";
import { motion } from "framer-motion";
import Link from "next/link";

const AboutPage = () => {
  return (
    <Container>
      {/* Hero Section */}
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-left"
        >
          <h4 className="text-shop_light_green font-medium mb-2 uppercase tracking-wide">
            About Motozoop
          </h4>

          <h1 className="text-2xl md:text-3xl font-semibold text-shop_dark_green mb-5 leading-snug">
            We are one of the leading Car Interior and Exterior Accessories
            sellers
          </h1>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
            Welcome to <span className="font-semibold text-shop_light_green">MotoZoop</span>, your
            ultimate destination for all things automotive! We’re not just
            another car accessories store — we’re a passionate community of
            gearheads and car enthusiasts dedicated to bringing you the latest
            and greatest in automotive enhancements.
          </p>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
            Born from a shared love for cars, MotoZoop was founded to elevate
            the driving experience for enthusiasts worldwide. Our mission is to
            curate a one-stop shop for high-quality car accessories that blend
            style, functionality, and innovation.
          </p>


<div>
  <Link href="/contact" passHref>
    <button className="bg-shop_dark_green text-white px-6 py-2.5 rounded-lg hover:bg-shop_btn_dark_green transition text-sm font-medium">
      Contact Us
    </button>
  </Link>
</div>

        </motion.div>
      </section>

      {/* What We Offer Section */}
      <section className="py-10 bg-shop_light_bg rounded-2xl shadow-sm mt-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-left"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-shop_dark_green mb-3">
            What We Offer
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            At MotoZoop, we understand that every car is as unique as its owner.
            That&apos;s why we offer an extensive range of premium car accessories,
            carefully selected to cater to various tastes and preferences. From
            sleek interior upgrades to rugged exterior enhancements, we&apos;ve got
            everything you need to personalize your ride and make a bold
            statement on the road.
          </p>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-left"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-shop_dark_green mb-3">
            Why Choose MotoZoop
          </h2>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-3">
            <span className="font-semibold">Quality Assurance:</span> We believe
            in offering only the best to our customers. Each product in our
            catalog undergoes rigorous quality checks to ensure superior
            durability and craftsmanship.
          </p>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-3">
            <span className="font-semibold">Expert Support:</span> Have a
            question or need assistance? Our dedicated team of automotive
            specialists is always ready to provide guidance, from compatibility
            checks to installation advice.
          </p>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            <span className="font-semibold">Customer Satisfaction:</span> Your
            satisfaction drives us. We strive to exceed expectations with
            seamless shopping experiences, reliable shipping, and hassle-free
            returns — every single time.
          </p>
        </motion.div>
      </section>
    </Container>
  );
};

export default AboutPage;

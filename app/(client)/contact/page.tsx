"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => {
  return (
    <Container>
      {/* Hero Section */}
      <section className="py-12 text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h4 className="text-shop_light_green font-medium mb-4 uppercase tracking-wide">
            Get in Touch
          </h4>
          <h1 className="text-xl md:text-2xl font-semibold text-shop_dark_green mb-2 leading-snug">
            We’d Love to Hear from You
          </h1>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Whether you have a question about our products, need assistance with
            an order, or simply want to share feedback — the MotoZoop team is
            here to help. Reach out using the form below or through our contact
            details.
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4 mb-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-2xl shadow-sm"
        >
          <h2 className="text-xl font-semibold text-shop_dark_green mb-4">
            Send Us a Message
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_light_green outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_light_green outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_light_green outline-none"
                placeholder="Subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_light_green outline-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-shop_dark_green text-white px-6 py-2.5 rounded-lg hover:bg-shop_btn_dark_green transition text-sm font-medium"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-shop_light_bg p-8 rounded-2xl shadow-sm flex flex-col justify-center"
        >
          <h2 className="text-xl font-semibold text-shop_dark_green mb-4">
            Contact Details
          </h2>
          <div className="space-y-4 text-gray-700 text-base">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-shop_dark_green" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-shop_dark_green" />
              <span>motozoop@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-shop_dark_green" />
              <span>Dharapuram, Tamil Nadu, India</span>
            </div>
          </div>
        </motion.div>
      </section>
    </Container>
  );
};

export default ContactPage;

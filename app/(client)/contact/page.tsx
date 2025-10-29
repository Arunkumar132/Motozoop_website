"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Container from "@/components/Container";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${window.location.origin}/api/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: { error?: string } = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: unknown) {
      // ✅ type-safe error handling
      if (error instanceof Error) {
        console.error("Error:", error.message);
        toast.error(error.message || "Network error. Please try again.");
      } else {
        console.error("Unknown error:", error);
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

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
            Questions about products or orders? Send us a message!
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_light_green outline-none"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_light_green outline-none"
              required
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_light_green outline-none"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Your Message"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-shop_light_green outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-shop_dark_green text-white px-6 py-2.5 rounded-lg hover:bg-shop_btn_dark_green transition text-sm font-medium flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : null}
              {loading ? "Sending..." : "Send Message"}
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
              <span>2025.motozoop@gmail.com</span>
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

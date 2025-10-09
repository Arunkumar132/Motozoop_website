"use client";

import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FaStar, FaHandsHelping, FaChartLine, FaShieldAlt } from "react-icons/fa";

const FranchiseEnquiry = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    investment: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, email, phone } = formData;
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Name, Email, and Phone are required.");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number (10-15 digits).");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/franchise-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Enquiry submitted successfully!");
        setFormData({ name: "", email: "", phone: "", location: "", investment: "", message: "" });
      } else {
        toast.error("Error submitting enquiry. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">

      {/* Intro Message Outside Box */}
      <div className="mb-6 text-left">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 mt-4">Franchise Enquiry</h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-1">
          Join <span className="font-semibold text-shop_light_green">MotoZoop</span>, one of the leading car interior and exterior
          accessories brands, and become part of a growing network of passionate automotive entrepreneurs.
        </p>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          Our franchise offers a proven business model, high-quality products, marketing support, and training programs to help you succeed in the automotive market.
        </p>
      </div>

      {/* Why Choose Our Franchise Section Outside Box */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 text-left">
        <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
          <FaStar className="text-shop_dark_green w-10 h-10 mb-2" />
          <h3 className="font-semibold text-gray-800 mb-1">Proven Brand</h3>
          <p className="text-gray-600 text-sm">Leverage our trusted and recognized brand to attract customers quickly.</p>
        </div>

        <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
          <FaHandsHelping className="text-shop_dark_green w-10 h-10 mb-2" />
          <h3 className="font-semibold text-gray-800 mb-1">Full Support</h3>
          <p className="text-gray-600 text-sm">We provide marketing, training, and operational guidance to ensure your success.</p>
        </div>

        <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
          <FaChartLine className="text-shop_dark_green w-10 h-10 mb-2" />
          <h3 className="font-semibold text-gray-800 mb-1">High Profit Potential</h3>
          <p className="text-gray-600 text-sm">A proven business model with attractive returns in the booming automotive accessories market.</p>
        </div>

        <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
          <FaShieldAlt className="text-shop_dark_green w-10 h-10 mb-2" />
          <h3 className="font-semibold text-gray-800 mb-1">Trusted Quality</h3>
          <p className="text-gray-600 text-sm">Offer premium products with rigorous quality checks that customers trust.</p>
        </div>
      </section>

      {/* Franchise Form Inside Box with Top Margin */}
      <div className="bg-white border shadow-xl rounded-2xl p-6 pb-10 md:pb-8 mt-4 mb-10">
        <Toaster position="top-right" />
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
          />
          <input
            type="text"
            name="location"
            placeholder="Preferred Location (optional)"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
          />
          <input
            type="text"
            name="investment"
            placeholder="Investment Capacity (optional)"
            value={formData.investment}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
          />
          <textarea
            name="message"
            placeholder="Message (optional)"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full md:col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:col-span-2 py-3 rounded-lg text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-shop_dark_green hover:bg-shop_btn_dark_green"
            }`}
          >
            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FranchiseEnquiry;

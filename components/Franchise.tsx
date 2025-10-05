"use client";

import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

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
    <div className="w-full max-w-3xl mx-auto p-6 pb-10 md:pb-16 bg-white shadow-xl rounded-2xl mt-8 sm:mt-10 sm:p-8">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Franchise Enquiry</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
        />
        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
        />
        {/* Phone */}
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
        />
        {/* Location */}
        <input
          type="text"
          name="location"
          placeholder="Preferred Location (optional)"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
        />
        {/* Investment */}
        <input
          type="text"
          name="investment"
          placeholder="Investment Capacity (optional)"
          value={formData.investment}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
        />
        {/* Message spans full width */}
        <textarea
          name="message"
          placeholder="Message (optional)"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full md:col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
        />
        {/* Submit Button spans full width */}
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
  );
};

export default FranchiseEnquiry;

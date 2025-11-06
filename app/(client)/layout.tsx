"use client";

import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

import Header from "@/components/header";
import Footer from "@/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="font-poppins antialiased min-h-screen flex flex-col bg-white text-gray-900">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111111",
              color: "#ffffff",
              borderRadius: "8px",
              fontSize: "14px",
            },
          }}
        />

        {/* Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </div>
    </ClerkProvider>
  );
}

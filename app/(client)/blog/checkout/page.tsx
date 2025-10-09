"use client";
import React from "react";

export default function CheckoutPage() {
  const handlePayment = async () => {
    try {
      const orderResponse = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 500, // ₹500
          currency: "INR",
          receipt: "receipt#1",
        }),
      });

      const data = await orderResponse.json();
      if (!data.orderId) {
        alert("Failed to create order");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // public key
        amount: 500 * 100,
        currency: "INR",
        name: "Motozoop",
        description: "Test Transaction",
        order_id: data.orderId,
        handler: function (response: any) {
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: "Arunkumar M",
          email: "arun@example.com",
          contact: "9876543210",
        },
        notes: {
          address: "Motozoop Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Checkout Page</h1>
      <button
        onClick={handlePayment}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Pay ₹500
      </button>
    </div>
  );
}

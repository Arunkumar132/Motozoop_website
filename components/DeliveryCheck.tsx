"use client";

import React, { useState, useEffect } from "react";
import { Truck } from "lucide-react";

const DeliveryCheck = () => {
  const [pin, setPin] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleCheck = () => {
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (pinRegex.test(pin)) {
      showCustomToast(`✅ Delivery available for PIN ${pin}`);
    } else {
      showCustomToast("❌ Please enter a valid 6-digit PIN code");
    }
  };

  const showCustomToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="border border-darkColor/50 p-3 flex flex-col md:flex-row items-start md:items-center gap-4 relative">
      <Truck size={30} className="text-shop_orange" />
      <div className="flex-1">
        <p className="text-base font-semibold text-black cursor-pointer"
           onClick={() => setShowInput(!showInput)}>
          Free Delivery
        </p>
        <p className="text-base text-gray-500 underline underline-offset-2 mb-2 cursor-pointer"
           onClick={() => setShowInput(!showInput)}>
          Enter the Postal Code for Delivery Availability.
        </p>

        {showInput && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN code"
              className="border p-2 rounded-md flex-1"
            />
            <button
              onClick={handleCheck}
              className="bg-shop_orange text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
            >
              Check
            </button>
          </div>
        )}
      </div>

      {/* Custom Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-5 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Tailwind animation */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DeliveryCheck;

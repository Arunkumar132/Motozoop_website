"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

const ReturnModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const instructions = [
    "1. Items must be returned within 30 days of delivery.",
    "2. Products should be in original packaging and unused.",
    "3. Include the original invoice or receipt.",
    "4. Refunds will be processed to the original payment method.",
    "5. For defective or damaged items, please contact support immediately."
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="underline text-gray-500 hover:text-black text-sm"
      >
        Details
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-11/12 max-w-lg rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Return Instructions</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ReturnModal;

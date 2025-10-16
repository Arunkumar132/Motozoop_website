"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Truck, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STEPS = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    setStatus("");

    // Simulate API call
    setTimeout(() => {
      const randomStatus = STATUS_STEPS[Math.floor(Math.random() * STATUS_STEPS.length)];
      setStatus(randomStatus);
      setLoading(false);
    }, 1500);
  };

  const getStatusIcon = (step: string, currentStatus: string) => {
    const isActive = STATUS_STEPS.indexOf(step) <= STATUS_STEPS.indexOf(currentStatus);
    const colors = {
      Processing: "bg-yellow-500",
      Shipped: "bg-blue-500",
      "Out for Delivery": "bg-orange-500",
      Delivered: "bg-green-500",
    };

    return (
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-500
        ${isActive ? colors[step as keyof typeof colors] : "bg-gray-300"}`}
      >
        {step === "Delivered" ? <CheckCircle2 /> : <Package />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-50 flex flex-col items-center py-12">
      <Card className="w-11/12 max-w-2xl shadow-xl border border-gray-200 overflow-hidden">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-center text-3xl font-extrabold text-gray-800">
            Track Your Order
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-8">
          {/* Input */}
          <div className="flex gap-3 mb-8">
            <Input
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <Button
              onClick={handleTrackOrder}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              Track
            </Button>
          </div>

          {/* Status Timeline */}
          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between relative mb-6">
                  {STATUS_STEPS.map((step, idx) => (
                    <div key={step} className="flex-1 flex flex-col items-center relative">
                      {getStatusIcon(step, status)}
                      <span className="mt-2 text-sm font-medium text-gray-700 text-center">
                        {step}
                      </span>

                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute top-5 left-1/2 w-full h-1 bg-gray-300 -z-10`}
                          style={{ transform: "translateX(50%)" }}
                        />
                      )}
                    </div>
                  ))}
                  {/* Active Line */}
                  <motion.div
                    className="absolute top-5 left-0 h-1 bg-green-500 z-0"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(STATUS_STEPS.indexOf(status) / (STATUS_STEPS.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-lg font-semibold text-gray-800">{status}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Order ID: <span className="font-mono">{orderId}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <a
          href="/help"
          className="text-green-600 hover:underline font-medium"
        >
          Need help?
        </a>
      </div>
    </div>
  );
}

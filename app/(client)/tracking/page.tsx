"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Truck, Package } from "lucide-react";

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
      // Example logic – replace this with your backend fetch
      const mockStatuses = ["Processing", "Shipped", "Out for Delivery", "Delivered"];
      const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      setStatus(randomStatus);
      setLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 className="text-green-600 w-6 h-6" />;
      case "Out for Delivery":
        return <Truck className="text-orange-500 w-6 h-6" />;
      default:
        return <Package className="text-blue-600 w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
      <Card className="w-11/12 max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Track Your Order
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTrackOrder} disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Track"}
            </Button>
          </div>

          {status && (
            <div className="text-center mt-4 p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                {getStatusIcon(status)}
                <p className="text-lg font-semibold text-gray-700">
                  {status}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-gray-600">Need help?</p>
        <a
          href="/social-media-ids"
          className="text-blue-600 hover:underline"
        >
          Contact us via Social Media
        </a>
      </div>
    </div>
  );
}

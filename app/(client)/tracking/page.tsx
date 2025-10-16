"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { client } from "@/sanity/lib/client";

// Delivery partner tracking URLs
const DELIVERY_URLS: Record<string, string> = {
  DTDC: "https://www.dtdc.com/track-your-shipment/",
  "French Express": "https://franchexpress.com/courier-tracking/",
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [deliveryPartner, setDeliveryPartner] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrderDetails = async () => {
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError("");
    setOrderStatus("");
    setTrackingId("");
    setDeliveryPartner("");

    try {
      const query = `
        *[_type == "order" && orderNumber == $orderNumber][0]{
          orderNumber,
          status,
          trackingId,
          deliveryPartner
        }
      `;

      const order = await client.fetch(query, { orderNumber: orderNumber.trim() });

      if (!order) {
        setError("No order found with the provided Order Number.");
        return;
      }

      setOrderStatus(order.status || "Processing");
      setTrackingId(order.trackingId || "Pending assignment");
      setDeliveryPartner(order.deliveryPartner || "Pending assignment");
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Unable to retrieve order information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className=" bg-gray-50 flex flex-col items-center py-12"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <Card className="w-11/12 max-w-xl shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-center text-3xl font-extrabold text-gray-800">
            Track Your Order
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 py-1">
          {/* Input Section */}
          <div className="flex gap-3 mb-6">
            <Input
              placeholder="Enter Order Number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="flex-1 border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <Button
              onClick={fetchOrderDetails}
              disabled={loading}
              className="bg-shop_dark_green hover:bg-shop_dark_green/80 text-white flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              Track
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-center font-medium mb-4">{error}</p>
          )}

          {/* Order Details */}
          {orderStatus && (
            <div className="bg-gray-100 rounded-lg p-6 text-center space-y-2">
              <p className="text-lg font-bold text-gray-800 uppercase">{orderStatus}</p>
              <p className="text-sm text-gray-500">
                Order Number: <span className="font-mono">{orderNumber}</span>
              </p>
              <p className="text-sm text-gray-500">
                Tracking ID: <span className="font-mono">{trackingId}</span>
              </p>
              <p className="text-sm text-shop_dark_green">
                Delivery Partner: <span className="font-semibold">{deliveryPartner}</span>
              </p>

              {deliveryPartner in DELIVERY_URLS && trackingId && trackingId !== "Pending assignment" && (
                <a href={DELIVERY_URLS[deliveryPartner]} target="_blank" rel="noopener noreferrer">
                  <Button className="mt-4 bg-shop_dark_green hover:bg-shop_dark_green/80 text-white">
                    Track on {deliveryPartner} Website
                  </Button>
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <a href="/help" className="text-shop_dark_green/60 hover:underline font-medium">
          Need Assistance?
        </a>
      </div>
    </div>
  );
}

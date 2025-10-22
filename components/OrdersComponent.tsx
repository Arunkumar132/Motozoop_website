'use client';

import React, { useState } from "react";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { TableBody, TableCell, TableRow } from "./ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import Invoice from "./Invoice";

const OrdersComponent = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  // --- Helper: Open shipment tracking link ---
  const openTrackingLink = (trackingId: string, partner: string) => {
    if (!trackingId) {
      alert("Tracking ID not available for this order.");
      return;
    }

    if (partner === "dtdc") {
      window.open(`https://www.dtdc.com/tracking/?consignment=${trackingId}`, "_blank");
    } else if (partner === "french_express") {
      window.open("https://franchexpress.com/courier-tracking/", "_blank");
      alert(`Your tracking ID is: ${trackingId}\nPlease paste it into the French Express tracking box.`);
    } else {
      alert(`Tracking not available for partner: ${partner || "Unknown"}`);
    }
  };

  // --- Sort orders by date ---
  const sortedOrders = Array.isArray(orders)
    ? [...orders].sort(
        (a, b) => (new Date(b.orderDate).getTime() || 0) - (new Date(a.orderDate).getTime() || 0)
      )
    : [];

  return (
    <>
      <TableBody>
        <TooltipProvider>
          {sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <Tooltip key={order?.orderNumber}>
                <TooltipTrigger asChild>
                  <TableRow
                    className="cursor-pointer hover:bg-gray-100 h-12 transition-all"
                    onClick={() => handleOrderClick(order)}
                  >
                    {/* Order Number */}
                    <TableCell className="font-medium">{order?.orderNumber ?? "N/A"}</TableCell>

                    {/* Order Date */}
                    <TableCell className="hidden md:table-cell">
                      {order?.orderDate ? format(new Date(order.orderDate), "dd/MM/yyyy") : "--/--/----"}
                    </TableCell>

                    {/* Customer Name */}
                    <TableCell>
                      {typeof order.customerName === "string"
                        ? order.customerName
                        : order.customerName?.name ?? "Unknown"}
                    </TableCell>

                    {/* Email */}
                    <TableCell className="hidden sm:table-cell">
                      {typeof order.email === "string" ? order.email : order.email?.address ?? "N/A"}
                    </TableCell>

                    {/* Total Price */}
                    <TableCell>
                      <PriceFormatter amount={order?.totalPrice ?? 0} />
                    </TableCell>

                    {/* Order Status */}
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize
                          ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "out_for_delivery"
                              ? "bg-sky-100 text-sky-700"
                              : order.status === "packing"
                              ? "bg-orange-100 text-orange-700"
                              : order.status === "order_confirmed"
                              ? "bg-indigo-100 text-indigo-700"
                              : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {order.status ? order.status.replaceAll("_", " ") : "pending"}
                      </span>
                    </TableCell>

                    {/* Invoice Number */}
                    <TableCell>{order.invoiceId ?? "N/A"}</TableCell>

                    {/* Tracking ID (Clickable if exists) */}
                    <TableCell>
                      {order.trackingId ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openTrackingLink(order.trackingId, order.deliveryPartner ?? "");
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          {order.trackingId}
                        </button>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    {/* Delivery Partner */}
                    <TableCell>{order.deliveryPartner ?? "N/A"}</TableCell>
                  </TableRow>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to view Invoice</p>
                </TooltipContent>
              </Tooltip>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-gray-500 text-sm">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TooltipProvider>
      </TableBody>

      {/* Invoice Modal */}
      <Invoice open={open} onOpenChange={setOpen} order={selectedOrder} />
    </>
  );
};

export default OrdersComponent;

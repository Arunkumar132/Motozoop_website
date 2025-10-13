'use client';

import React, { useState } from "react";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { TableBody, TableCell, TableRow } from "./ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import { X } from "lucide-react";
import Invoice from "./Invoice";

const OrdersComponent = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleDelete = (order: any, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete order:", order.orderNumber);
  };

  const sortedOrders = Array.isArray(orders)
    ? [...orders].sort((a, b) => (new Date(b.orderDate).getTime() || 0) - (new Date(a.orderDate).getTime() || 0))
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


                    <TableCell>
                      <p className="">
                        {order.invoiceId ? order.invoiceId : "N/A"}
                      </p>
                    </TableCell>


                    
                  </TableRow>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to view Invoice</p>
                </TooltipContent>
              </Tooltip>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-gray-500 text-sm">
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

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

                    {/* Status */}
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <p className="font-bold">--------</p>
                    </TableCell>

                    {/* Delete */}
                    <TableCell
                      className="flex items-center justify-center group"
                    >
                      <X size={18} className="group-hover:text-red-600 transition" />
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

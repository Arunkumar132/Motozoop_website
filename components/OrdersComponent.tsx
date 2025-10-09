'use client';

import React from "react";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { TableBody, TableCell, TableRow } from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import { X } from "lucide-react";

interface OrdersComponentProps {
  orders?: MY_ORDERS_QUERYResult; // mark as optional to handle undefined safely
}

const OrdersComponent = ({ orders = [] }: OrdersComponentProps) => {
  return (
    <TableBody>
      <TooltipProvider>
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => (
            <Tooltip key={order?.orderNumber}>
              <TooltipTrigger asChild>
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 h-12"
                  // onClick={() => handleOrderClick(order)}
                >
                  {/* Order Number */}
                  <TableCell className="font-medium">
                    {order?.orderNumber
                      ? `${order.orderNumber.slice(-10)}...`
                      : "NA"}
                  </TableCell>

                  {/* Order Date */}
                  <TableCell className="hidden md:table-cell">
                    {order?.orderDate
                      ? format(new Date(order.orderDate), "dd/MM/yyyy")
                      : "--/--/----"}
                  </TableCell>

                  {/* Customer Name */}
                  <TableCell>{order?.CustomerName ?? "Unknown"}</TableCell>

                  {/* Email */}
                  <TableCell className="hidden sm:table-cell">
                    {order?.email ?? "N/A"}
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <PriceFormatter
                      amount={order?.totalPrice ?? 0}
                      className="text-black font-medium"
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {order?.status && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    )}
                  </TableCell>

                  {/* Invoice */}
                  <TableCell className="hidden sm:table-cell">
                    <p className="font-medium line-clamp-1">
                      {order?.invoice?.number ?? "----"}
                    </p>
                  </TableCell>

                  {/* Delete / Action */}
                  <TableCell
                    className="flex items-center justify-center group"
                    // onClick={(event) => {
                    //   event.stopPropagation();
                    //   handleDelete(order);
                    // }}
                  >
                    <X
                      size={20}
                      className="group-hover:text-shop_dark_green hoverEffect"
                    />
                  </TableCell>
                </TableRow>
              </TooltipTrigger>

              <TooltipContent>
                <p>Click to see Order Details</p>
              </TooltipContent>
            </Tooltip>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-center py-6 text-gray-500 text-sm"
            >
              No orders found.
            </TableCell>
          </TableRow>
        )}
      </TooltipProvider>
    </TableBody>
  );
};

export default OrdersComponent;

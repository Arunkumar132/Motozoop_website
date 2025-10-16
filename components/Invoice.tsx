"use client";

import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
}

const formatAddress = (addr: any) => {
  if (!addr) return "Customer address";
  return `${addr.name ?? ""} ${addr.address ?? ""}, ${addr.city ?? ""}, ${addr.state ?? ""}, ${addr.zip ?? ""}, Mobile: ${addr.mobile ?? ""}`;
};

const Invoice: React.FC<InvoiceProps> = ({ open, onOpenChange, order }) => {
  if (!order) return null;

  // Map products and compute discounted price
  const products =
    order.products?.map((item: any) => {
      const productRef = item.product;
      const price = productRef?.price ?? 0;
      const discount = productRef?.discount ?? 0; // assume discount is stored in product
      const quantity = item.quantity ?? 1;
      const discountedPrice = price - (price * discount) / 100;
      const subtotal = discountedPrice * quantity;

      return {
        name: productRef?.name ?? "Product",
        price,
        discount,
        discountedPrice,
        quantity,
        subtotal,
      };
    }) ?? [
      {
        name: "Product",
        price: 0,
        discount: 0,
        discountedPrice: 0,
        quantity: 1,
        subtotal: 0,
      },
    ];

  const originalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalPrice = products.reduce((sum, p) => sum + p.subtotal, 0);
  const amountDiscount = originalPrice - totalPrice;

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    const img = new Image();
    img.src = "/logo1.png";
    img.onload = () => {
      const imgWidth = 40;
      const imgHeight = (img.height / img.width) * imgWidth;
      doc.addImage(img, "PNG", 160, 10, imgWidth, imgHeight);

      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("MotoZoop", 14, 20);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Car Accessories Pvt. Ltd.", 14, 26);
      doc.text("123 Auto Street, Chennai, India", 14, 31);
      doc.text("support@motozoop.com | +91 98765 43210", 14, 36);

      doc.line(14, 40, 195, 40);

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 14, 50);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice #: ${order.invoiceId ?? "N/A"}`, 14, 60);
      doc.text(`Order #: ${order.orderNumber ?? "N/A"}`, 14, 67);
      doc.text(
        `Date: ${order.orderDate ? format(new Date(order.orderDate), "dd/MM/yyyy") : "--/--/----"}`,
        14,
        74
      );

      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 14, 86);
      doc.setFont("helvetica", "normal");
      doc.text(formatAddress(order.address), 14, 92);

      const rows = products.map((p, i) => [
        i + 1,
        p.name,
        p.quantity,
        `₹${p.discount > 0 ? p.discountedPrice.toLocaleString() : p.price.toLocaleString()}`,
        `₹${p.subtotal.toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: 110,
        head: [["#", "Product", "Qty", "Price", "Subtotal"]],
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [34, 197, 94], textColor: 255 },
        styles: { fontSize: 11, cellPadding: 3 },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFont("helvetica", "bold");
      doc.text("Original Total:", 140, finalY);
      doc.text(`₹${originalPrice.toLocaleString()}`, 180, finalY, { align: "right" });

      doc.text("Discount:", 140, finalY + 6);
      doc.text(`₹${amountDiscount.toLocaleString()}`, 180, finalY + 6, { align: "right" });

      doc.text("Total:", 140, finalY + 12);
      doc.text(`₹${totalPrice.toLocaleString()}`, 180, finalY + 12, { align: "right" });

      doc.line(140, finalY + 14, 195, finalY + 14);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Thank you for shopping with MotoZoop!", 14, finalY + 26);
      doc.text("support@motozoop.com", 14, finalY + 32);

      doc.save(`Invoice_${order.orderNumber || "Order"}.pdf`);
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-6 bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold">MotoZoop</h2>
            <p className="text-sm text-gray-500">174/2, Goundachiputhur Road</p>
            <p className="text-sm text-gray-500">Ellis Nagar, Dharapuram, Tamil Nadu</p>
            <p className="text-sm text-gray-500">
              support@motozoop.com | +91 98765 43210
            </p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p><strong>Invoice : </strong>{order.invoiceId ?? "N/A"}</p>
            <p><strong>Order : </strong>{order.orderNumber ?? "N/A"}</p>
            <p><strong>Date: </strong>{order.orderDate ? format(new Date(order.orderDate), "dd/MM/yyyy") : "--/--/----"}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${order.status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
            </span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-4 text-sm">
          <strong>Delivery Address:</strong>
          <p>{order.address?.address ?? "N/A"}</p>
          <p className="text-gray-600">{order.address?.city ? `${order.address.city}, ` : ""}{order.address?.state ? `${order.address.state} ` : ""}{order.address?.zip ?? ""}</p>
          <p className="text-gray-600">{order.address?.mobile ?? ""}</p>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">S.No</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.quantity}</td>
                  <td className="p-2 border">₹{p.price.toLocaleString()}</td>
                  <td className="p-2 border font-medium">₹{p.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex flex-col items-end text-sm font-semibold space-y-1">
          <div className="w-1/2 flex justify-between">
            <span>Original Total:</span>
            <span>₹{originalPrice.toLocaleString()}</span>
          </div>
          <div className="w-1/2 flex justify-between">
            <span>Discount:</span>
            <span>₹{amountDiscount.toLocaleString()}</span>
          </div>
          <div className="w-1/2 flex justify-between">
            <span>Total:</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-center text-sm text-gray-500">
          Thank you for shopping with MotoZoop! For any queries, contact motozoop@gmail.com
        </div>

        {/* Download Button */}
        <div className="flex justify-end mt-4">
          <Button onClick={handleDownloadInvoice} className="bg-green-600 hover:bg-green-700 text-white">
            Download Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Invoice;

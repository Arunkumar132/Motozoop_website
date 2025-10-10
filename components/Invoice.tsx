'use client';

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

  // Safely get products
  const products = order.products || order.items || order.lineItems || [
    { name: "Car Accessory", quantity: 1, price: order.totalPrice ?? 0 },
  ];

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    // Load logo from public folder
    const img = new Image();
    img.src = "/logo1.png";
    img.onload = () => {
      const imgWidth = 40;
      const imgHeight = (img.height / img.width) * imgWidth;
      doc.addImage(img, "PNG", 160, 10, imgWidth, imgHeight);

      // Company Info
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("MotoZoop", 14, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Car Accessories Pvt. Ltd.", 14, 26);
      doc.text("123 Auto Street, Chennai, India", 14, 31);
      doc.text("support@motozoop.com | +91 98765 43210", 14, 36);

      doc.line(14, 40, 195, 40);

      // Invoice Info
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 14, 50);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice #: ${order?.invoice?.number ?? "N/A"}`, 14, 60);
      doc.text(`Order #: ${order?.orderNumber ?? "N/A"}`, 14, 67);
      doc.text(
        `Date: ${order.orderDate ? format(new Date(order.orderDate), "dd/MM/yyyy") : "--/--/----"}`,
        14,
        74
      );

      // Customer Info
      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 14, 86);
      doc.setFont("helvetica", "normal");
      doc.text(order.customerName ?? "N/A", 14, 92);
      doc.text(order.email ?? "N/A", 14, 97);
      doc.text(formatAddress(order.address), 14, 102);

      // Products Table
      const rows = products.map((p: any, i: number) => [
        i + 1,
        p.name ?? "Product",
        p.quantity ?? 1,
        `₹${(p.price ?? 0).toLocaleString()}`,
        `₹${((p.price ?? 0) * (p.quantity ?? 0)).toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: 110,
        head: [["#", "Product", "Qty", "Price", "Subtotal"]],
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [34, 197, 94], textColor: 255 },
        styles: { fontSize: 11, cellPadding: 3 },
      });

      // Total
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      const total = products.reduce(
        (sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 0),
        0
      );

      doc.setFont("helvetica", "bold");
      doc.text("Total:", 140, finalY);
      doc.text(`₹${total.toLocaleString()}`, 180, finalY, { align: "right" });

      doc.line(140, finalY + 2, 195, finalY + 2);

      // Footer
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Thank you for shopping with MotoZoop!", 14, finalY + 20);
      doc.text("support@motozoop.com", 14, finalY + 26);

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
            <p className="text-sm text-gray-500">Car Accessories Pvt. Ltd.</p>
            <p className="text-sm text-gray-500">123 Auto Street, Chennai, India</p>
            <p className="text-sm text-gray-500">support@motozoop.com | +91 98765 43210</p>
          </div>
          <div className="w-24 h-24">
            <img src="/logo1.png" alt="MotoZoop Logo" className="object-contain w-full h-full" />
          </div>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p><strong>Invoice #: </strong>{order?.invoice?.number ?? "N/A"}</p>
            <p><strong>Order #: </strong>{order?.orderNumber ?? "N/A"}</p>
            <p><strong>Date: </strong>{order.orderDate ? format(new Date(order.orderDate), "dd/MM/yyyy") : "--/--/----"}</p>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                order.status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
            </span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-4 text-sm">
          <p><strong>Bill To:</strong> {order.customerName ?? "N/A"}</p>
          <p>{order.email ?? "N/A"}</p>
          <p>{formatAddress(order.address)}</p>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any, i: number) => (
                <tr key={i} className="border-b">
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border">{p.name ?? "Product"}</td>
                  <td className="p-2 border">{p.quantity ?? 1}</td>
                  <td className="p-2 border">₹{(p.price ?? 0).toLocaleString()}</td>
                  <td className="p-2 border">₹{((p.price ?? 0) * (p.quantity ?? 0)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-4 text-sm font-semibold">
          <div className="w-1/2 flex justify-between">
            <span>Total:</span>
            <span>
              ₹{products.reduce((sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 0), 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-center text-sm text-gray-500">
          Thank you for shopping with MotoZoop! For any queries, contact support@motozoop.com
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

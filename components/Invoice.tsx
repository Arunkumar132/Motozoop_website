"use client";

import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Image from "next/image";

interface InvoiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
}

const formatAddressForDisplay = (addr: any) => {
  if (!addr) {
    return <p className="text-gray-600 text-xs">Customer address not provided</p>;
  }

  return (
    <div className="text-gray-600 text-xs space-y-0.5">
      {addr.name && <p className="font-medium text-gray-800">{addr.name}</p>}
      {addr.address && <p>{addr.address}</p>}
      <p>
        {addr.city && <span>{addr.city}</span>}
        {addr.state && <span>, {addr.state}</span>}
        {addr.zip && <span> - {addr.zip}</span>}
      </p>
      {addr.mobile && <p>Mobile: {addr.mobile}</p>}
    </div>
  );
};

const formatAddressForPDF = (addr: any) => {
  if (!addr) return ["Customer address not provided"];

  const lines = [];
  if (addr.name) lines.push(addr.name);
  if (addr.address) lines.push(addr.address);

  const cityStateZip = [addr.city, addr.state, addr.zip].filter(Boolean).join(", ");
  if (cityStateZip) lines.push(cityStateZip);

  if (addr.mobile) lines.push(`Mobile: ${addr.mobile}`);

  return lines;
};

const Invoice: React.FC<InvoiceProps> = ({ open, onOpenChange, order }) => {
  const [logoBase64, setLogoBase64] = React.useState<string | null>(null);
  const [downloading, setDownloading] = React.useState(false);

  React.useEffect(() => {
    fetch("/Untitled_design-removebg-preview.png")
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setLogoBase64(reader.result as string);
        reader.readAsDataURL(blob);
      });
  }, []);

  if (!order) return null;

  // Map products
  const products =
    order.products?.map((item: any) => {
      const productRef = item.product;
      const price = parseFloat(productRef?.price) || 0;
      const discount = parseFloat(productRef?.discount) || 0;
      const quantity = parseInt(item.quantity) || 1;
      const discountedPrice = +(price * (1 - discount / 100)).toFixed(2);
      const subtotal = discountedPrice * quantity;

      return {
        name: productRef?.name ?? "Product",
        price,
        discount,
        discountedPrice,
        quantity,
        subtotal,
      };
    }) ?? [];

  const totalPrice = products.reduce((sum, p) => sum + p.subtotal, 0);

  const handleDownloadInvoice = async () => {
    setDownloading(true);
    const doc = new jsPDF("p", "mm", "a4");

    // Add centered logo (large and clear)
    if (logoBase64) {
      const imgWidth = 80;
      const imgHeight = 80 * 0.4;
      const xPos = (210 - imgWidth) / 2;
      doc.addImage(logoBase64, "PNG", xPos, 10, imgWidth, imgHeight);
    }

    const headerBottomY = 10 + 80 * 0.4 + 10;
    doc.line(14, headerBottomY, 195, headerBottomY);

    // Company Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("MotoZoop", 14, headerBottomY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("174/2, Goundachiputhur Road, Ellis Nagar,", 14, headerBottomY + 16);
    doc.text("Dharapuram, Tamil Nadu", 14, headerBottomY + 21);
    doc.text("support@motozoop.com | +91 98765 43210", 14, headerBottomY + 26);

    // Invoice Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 14, headerBottomY + 38);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice : ${order.invoiceId ?? "N/A"}`, 14, headerBottomY + 46);
    doc.text(`Order : ${order.orderNumber ?? "N/A"}`, 14, headerBottomY + 52);
    doc.text(
      `Date: ${order.orderDate ? format(new Date(order.orderDate), "dd/MM/yyyy") : "--/--/----"}`,
      14,
      headerBottomY + 58
    );
    doc.text(
      `Status: ${order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}`,
      14,
      headerBottomY + 64
    );

    // Address
    doc.setFont("helvetica", "bold");
    doc.text("Delivery Address:", 14, headerBottomY + 74);
    doc.setFont("helvetica", "normal");
    const addressLines = formatAddressForPDF(order.address);
    addressLines.forEach((line, index) => {
      doc.text(line, 14, headerBottomY + 86 + index * 6);
    });

    // Products Table
    const tableStartY = headerBottomY + 80 + addressLines.length * 6 + 10;
    const rows = products.map((p, i) => [
      i + 1,
      p.name,
      p.quantity,
      `Rs. ${p.discountedPrice.toFixed(2)}`,
      `Rs. ${p.subtotal.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: tableStartY,
      head: [["#", "Product", "Qty", "Price", "Subtotal"]],
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontSize: 10,
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        font: "helvetica",
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 85 },
        2: { cellWidth: 15 },
        3: { cellWidth: 40, halign: "right" },
        4: { cellWidth: 40, halign: "right" },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Total Amount (proper right alignment)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 140, finalY);
    doc.text(`Rs. ${totalPrice.toFixed(2)}`, 195, finalY, { align: "right" });

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for shopping with MotoZoop!", 14, finalY + 15);
    doc.text("For any queries, contact: support@motozoop.com", 14, finalY + 21);

    doc.save(`Invoice_${order.orderNumber || "Order"}.pdf`);
    setDownloading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-4 bg-white rounded-lg shadow-lg">
        {/* Header with Logo */}
        <div className="flex items-start space-x-3 border-b pb-3 mb-3">
          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 p-1">
            <Image
              src="/logo1.png"
              alt="MotoZoop Logo"
              className="w-full h-full object-contain rounded"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold">MotoZoop</h2>
            <p className="text-xs text-gray-500 leading-tight">
              174/2, Goundachiputhur Road, Ellis Nagar, Dharapuram, Tamil Nadu
            </p>
            <p className="text-xs text-gray-500">support@motozoop.com | +91 98765 43210</p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          <div className="space-y-1">
            <p>
              <strong>Invoice :</strong> {order.invoiceId ?? "N/A"}
            </p>
            <p>
              <strong>Order :</strong> {order.orderNumber ?? "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {order.orderDate ? format(new Date(order.orderDate), "dd/MM/yyyy") : "--/--/----"}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                order.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
            </span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-800 text-xs mb-1">Delivery Address</h3>
          {formatAddressForDisplay(order.address)}
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-left border border-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-1 border">S.No</th>
                <th className="p-1 border">Product</th>
                <th className="p-1 border">Qty</th>
                <th className="p-1 border">Price</th>
                <th className="p-1 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-b">
                  <td className="p-1 border">{i + 1}</td>
                  <td className="p-1 border">{p.name}</td>
                  <td className="p-1 border">{p.quantity}</td>
                  <td className="p-1 border">Rs. {p.discountedPrice.toFixed(2)}</td>
                  <td className="p-1 border font-medium text-right">Rs. {p.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Amount */}
        <div className="flex justify-end border-t pt-3">
          <div className="w-full sm:w-1/2 flex justify-between text-base font-bold">
            <span>Total Amount:</span>
            <span className="text-right">Rs. {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-3 text-center text-xs text-gray-500 mt-3">
          Thank you for shopping with MotoZoop! For any queries, contact support@motozoop.com
        </div>

        {/* Download Button */}
        <div className="flex justify-end mt-3">
          <Button
            onClick={handleDownloadInvoice}
            disabled={downloading}
            className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4"
          >
            {downloading ? "Generating..." : "Download Invoice"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Invoice;

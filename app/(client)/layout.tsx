import type { Metadata } from "next";
import "../globals.css";

import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";

import { getOrders } from "@/sanity/queries"; // ✅ import fetcher
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: {
    default: "MotoZoop",
    template: "%s | MotoZoop",
  },
  description:
    "MotoZoop is a website for car accessories, your one-stop shop for all things automotive.",
};

// ✅ Make layout async so you can fetch data
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Fetch orders from Sanity on the server
    const {userId} = await auth();
    const orders = await getOrders(userId);

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-poppins antialiased min-h-screen flex flex-col">
          {/* ✅ Pass fetched orders to Header */}
          <Header orders={orders} />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

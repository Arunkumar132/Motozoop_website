import type { Metadata } from "next";
import "../globals.css";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    default: "MotoZoop",
    template: "%s | MotoZoop",
  },
  description:
    "MotoZoop is a website for car accessories, your one-stop shop for all things automotive.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
=======
  // ✅ Fetch orders from Sanity on the server
    const {userId} = await auth();
    const orders = await getOrders(userId);

>>>>>>> 6b20460c5d38c30c7d35d5bad35c760b88435614
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-poppins antialiased min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

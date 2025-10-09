import type { Metadata } from "next";
import "../globals.css";

import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "Motozoop",
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


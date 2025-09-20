import type { Metadata } from "next";
import "../globals.css";

import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "Shopping car accessories",
    template: "%s | MotoZoop",
  },
  description:
    "IT is a website for car accessories, your one-stop shop for all things automotive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased min-h-screen flex flex-col">
        <ClerkProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}

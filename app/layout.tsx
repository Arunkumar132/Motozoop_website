import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {ClerkProvider} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    default: "Shopping car accessories",
    template: "%s | MotoZoop",
  },
  description: "IT is a website for car accessories, your one-stop shop for all things automotive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className="font-poppins antialiased">
        <Header />
          {children}
        <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}

import { Toaster } from "react-hot-toast";
import { Poppins } from "next/font/google";
import Script from "next/script"; // ✅ Import Script for Razorpay
import "./globals.css";

// Load Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Admin",
  description: "Online automotive store – Shop quality auto parts and accessories",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased bg-white text-gray-900">
        {/* Main App Content */}
        <main>{children}</main>

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111111",
              color: "#ffffff",
              borderRadius: "8px",
              fontSize: "14px",
            },
          }}
        />

        {/* Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive" // ✅ Ensures script loads before your Cart page
        />
      </body>
    </html>
  );
}

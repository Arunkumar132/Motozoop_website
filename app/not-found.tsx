import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "404 | MotoZoop",
  description: "Page not found - MotoZoop",
};

const NotFoundPage = () => {
  return (
    <div className="bg-white flex flex-col items-center min-h-screen px-4 pt-16">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <Logo />

        {/* Heading */}
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Looking for something?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;re sorry. The web address you entered is not a functioning
          page on our site.
        </p>

        {/* Buttons */}
        <div className="mt-8 space-y-4">
          <Link
            href="/"
            aria-label="Go to MotoZoop home page"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-shop_dark_green/80 hover:bg-shop_dark_green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shop_dark_green hoverEffect"
          >
            Go to MotoZoop&apos;s home page
          </Link>
          <Link
            href="/help"
            aria-label="Go to help page"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-semibold rounded-md text-amazonBlue bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amazonBlue"
          >
            Help
          </Link>
        </div>

        {/* Footer Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Visit the{" "}
            <Link
              href="/help"
              className="font-medium text-amazonBlue hover:text-amazonBlue/80"
            >
              Help section
            </Link>{" "}
            or{" "}
            <Link
              href="/contact"
              className="font-medium text-amazonBlue hover:text-amazonBlue/80"
            >
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

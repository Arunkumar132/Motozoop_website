"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./Title";
import { categoriesData, quickLinksData } from "@/constants/data";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.", {
        position: "bottom-right",
        style: { background: "#1F2937", color: "#fff" },
      });
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.", {
        position: "bottom-right",
        style: { background: "#1F2937", color: "#fff" },
      });
      return;
    }

    setIsLoading(true);

    // Simulated backend call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    toast.success("You are now subscribed to Motozoop's newsletter!", {
      position: "bottom-right",
      style: { background: "#1F2937", color: "#fff" },
    });
    setEmail("");
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <Container>
        <FooterTop />

        {/* Main Footer Grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Section */}
          <div className="space-y-5">
            <Logo />
            <SubText className="text-gray-600">
              Motozoop Car — Your second home on the road.
            </SubText>
            <SocialMedia
              className="text-gray-600"
              iconClassName="border-gray-600 hover:border-shop_light_green hover:text-shop_light_green transition-colors"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>

          {/* Quick Links */}
          <div>
            <SubTitle className="text-darkColor font-semibold">
              Quick Links
            </SubTitle>
            <ul className="space-y-2 mt-4">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-sm text-gray-500 hover:text-shop_light_green transition-colors"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <SubTitle className="text-darkColor font-semibold">
              Categories
            </SubTitle>
            <ul className="space-y-2 mt-4">
              {categoriesData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category/${item?.href}`}
                    className="text-sm text-gray-500 hover:text-shop_light_green transition-colors"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <SubTitle className="text-darkColor font-semibold">Newsletter</SubTitle>
            <SubText className="text-gray-600">
              Subscribe to receive updates and exclusive offers directly in your inbox.
            </SubText>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border-gray-300 focus:ring-shop_light_green focus:border-shop_light_green"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-shop_dark_green hover:bg-shop_dark_green/90 transition-all flex items-center justify-center ${
                  isLoading ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="py-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <span>© {new Date().getFullYear()}</span>
            <div className="flex justify-center items-center gap-2">
              <span>Motozoop - All rights reserved.</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

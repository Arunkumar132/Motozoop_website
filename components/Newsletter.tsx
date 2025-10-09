"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SubText, SubTitle } from "./Title";

const Newsletter = () => {
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

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Subscription failed.", {
          position: "bottom-right",
          style: { background: "#1F2937", color: "#fff" },
        });
        return;
      }

      toast.success(data.message || "Subscribed successfully!", {
        position: "bottom-right",
        style: { background: "#1F2937", color: "#fff" },
      });
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-right",
        style: { background: "#1F2937", color: "#fff" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};

export default Newsletter;

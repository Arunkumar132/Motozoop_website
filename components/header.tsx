"use client";

import React, { useEffect, useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import Carticon from "./Carticon";
import FavoriteButton from "./FavoriteButton";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { Logs } from "lucide-react";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Header() {
  const [orderCount, setOrderCount] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          const res = await fetch(`/api/orders?userId=${user.id}`);
          const data = await res.json();
          setOrderCount(data.count || 0);
        } catch (err) {
          console.error("Failed to fetch order count:", err);
          setOrderCount(0);
        }
      })();
    }
  }, [user?.id]);

  return (
    <header className="bg-white/70 py-5 sticky top-0 z-50 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        {/* Left section */}
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>

        {/* Middle section */}
        <HeaderMenu />

        {/* Right section */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <Carticon />
          <FavoriteButton />

          <ClerkLoaded>
            <SignedIn>
              <div className="relative flex items-center gap-3">
                {/* Orders Link */}
                <Link
                  href="/orders"
                  className="inline-flex items-center justify-center relative group hover:text-shop_light_green transition"
                >
                  <Logs className="w-6 h-6 z-10" />
                </Link>

                {/* Badge */}
                {orderCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-4 w-4 rounded-full text-[10px] font-semibold flex items-center justify-center z-50">
                    {orderCount}
                  </span>
                )}

                {/* User Button */}
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <span className="text-sm font-medium cursor-pointer hover:text-shop_light_green">
                  Login
                </span>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
}

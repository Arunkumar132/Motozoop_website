"use client";

import React from "react";
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
} from "@clerk/nextjs";

interface HeaderProps {
  orders?: any[];
}

export default function Header({ orders = [] }: HeaderProps) {
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
              <Link
                href="/orders"
                className="relative inline-flex items-center justify-center group hover:text-shop_light_green transition"
              >
                <Logs className="w-6 h-6" />
                {orders.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-shop_btn_dark_green text-white h-4 w-4 rounded-full text-[10px] font-semibold flex items-center justify-center">
                    {orders.length}
                  </span>
                )}
              </Link>
              <UserButton afterSignOutUrl="/" />
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

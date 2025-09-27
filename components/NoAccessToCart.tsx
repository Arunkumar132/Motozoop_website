import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "./ui/card";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

const NoAccessToCart = () => {
  return (
    <div className="flex items-center justify-center py-12 md:py-32 bg-gray-100 px-4">
      <Card className="max-w-md w-full shadow-lg rounded-2xl p-6">
        {/* Header */}
        <CardHeader className="flex flex-col items-center space-y-3">
          <Logo />
          <CardTitle className="text-xl font-bold text-center text-gray-800">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Log in to view your cart items and checkout. Don’t miss your favorite products.
          </CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent>
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="w-full bg-shop_btn_dark_green/90 text-white font-semibold shadow hover:bg-shop_btn_dark_green hoverEffect"
            >
              Sign In
            </Button>
          </SignInButton>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-500">Don’t have an account?</p>
          <SignUpButton mode="modal">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-shop_btn_dark_green text-shop_btn_dark_green font-semibold hover:bg-shop_btn_dark_green/10"
            >
              Create an Account
            </Button>
          </SignUpButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccessToCart;

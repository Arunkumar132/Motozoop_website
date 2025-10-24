'use client'

import React from "react";
import { Button } from "./ui/button";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  selectedColor?: string | null;
  maxCount?: number; // maximum allowed quantity for this color
}

const QuantityButtons = ({ product, selectedColor, maxCount = 0 }: Props) => {
  const { getItemCount, addItem, removeItem } = useStore();
  const itemCount = getItemCount(product?._id, selectedColor);

  const handleIncrease = () => {
    if (itemCount < maxCount) {
      addItem(product, selectedColor);
    } else {
      toast.error("Cannot add more items, stock limit reached.");
    }
  };

  const handleDecrease = () => {
    if (itemCount > 0) {
      removeItem(product?._id, selectedColor);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleDecrease}
        disabled={itemCount <= 0}
        className="w-8 h-8 text-lg font-bold"
      >
        -
      </Button>
      <span className="w-6 text-center">{itemCount}</span>
      <Button
        onClick={handleIncrease}
        disabled={itemCount >= maxCount}
        className="w-8 h-8 text-lg font-bold"
      >
        +
      </Button>
    </div>
  );
};

export default QuantityButtons;

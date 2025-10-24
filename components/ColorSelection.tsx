"use client";

import React from "react";

interface ColorSelectionProps {
  colors: { colorName: string; stock: number }[];
  selectedColor: string | null;
  onSelectColor: (colorName: string) => void;
}

// Full color mapping
const COLOR_MAP: Record<string, string> = {
  red: "#FF0000",
  blue: "#0000FF",
  green: "#008000",
  yellow: "#FFFF00",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#808080",
  grey: "#808080",
  orange: "#FFA500",
  purple: "#800080",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  lime: "#00FF00",
  navy: "#000080",
  maroon: "#800000",
  olive: "#808000",
  teal: "#008080",
  silver: "#C0C0C0",
  gold: "#FFD700",
  beige: "#F5F5DC",
  indigo: "#4B0082",
  violet: "#EE82EE",
  coral: "#FF7F50",
  salmon: "#FA8072",
  mint: "#98FF98",
  lavender: "#E6E6FA",
};

export default function ColorSelection({
  colors,
  selectedColor,
  onSelectColor,
}: ColorSelectionProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {colors.map((color) => {
        const isSelected = selectedColor === color.colorName;
        const hexColor =
          COLOR_MAP[color.colorName.toLowerCase()] || "#ccc"; // fallback gray

        return (
          <button
            key={color.colorName}
            onClick={() => onSelectColor(color.colorName)}
            disabled={color.stock <= 0}
            className={`w-8 h-8 rounded-full border-2 transition ${
              isSelected
                ? "border-black scale-110"
                : "border-gray-300 hover:scale-105"
            }`}
            style={{ backgroundColor: hexColor }}
          ></button>
        );
      })}
    </div>
  );
}

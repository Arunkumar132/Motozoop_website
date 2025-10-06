"use client";

import React, { useState } from "react";

// Map of known color names → HEX values
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
  brown: "#8B4513",
  beige: "#F5F5DC",
  teal: "#008080",
  navy: "#000080",
  maroon: "#800000",
  olive: "#808000",
  gold: "#EFBF04",
  silver: "#C0C0C0",
  lavender: "#E6E6FA",
  skyblue: "#87CEEB",
  wine: "#722F37",
};

const getColorHex = (color: string): string => {
  if (!color) return "#ccc";

  // If user already provided a hex code
  if (color.startsWith("#")) return color;

  const normalized = color.replace(/\s+/g, "").toLowerCase();

  // Try to find a close match
  for (const [name, hex] of Object.entries(COLOR_MAP)) {
    if (normalized.includes(name)) return hex;
  }

  // Fallback neutral
  return "#ccc";
};

const ColorSelector = ({ colors }: { colors: string[] }) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
      <p className="font-semibold text-sm text-gray-700">
        Choose Color: <span className="text-black">{selectedColor}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => {
          const hex = getColorHex(color);
          return (
            <button
              key={index}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? "border-black scale-110" : "border-gray-300"
              } transition-all relative`}
              style={{ backgroundColor: hex }}
              onClick={() => setSelectedColor(color)}
              title={color}
              aria-label={`Select ${color}`}
            >
              {/* Add checkmark overlay if selected */}
              {selectedColor === color && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;

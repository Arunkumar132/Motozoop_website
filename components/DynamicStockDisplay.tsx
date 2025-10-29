"use client";

// ✅ Define a proper Color interface
interface Color {
  colorName: string;
  stock: number;
}

// ✅ Use the Color type instead of `any`
interface DynamicStockDisplayProps {
  colors: Color[];
  totalStock: number;
  selectedColor: string | null;
}

export default function DynamicStockDisplay({
  colors,
  totalStock,
  selectedColor,
}: DynamicStockDisplayProps) {
  const currentStock =
    selectedColor && colors.length > 0
      ? colors.find((c) => c.colorName === selectedColor)?.stock ?? 0
      : totalStock;

  const isStock = currentStock > 0;

  return (
    <p
      className={`inline-block px-4 py-1.5 text-sm font-semibold rounded-lg ${
        isStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      {isStock
        ? `In Stock (${currentStock})`
        : `Out of Stock (${currentStock})`}
    </p>
  );
}

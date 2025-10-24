import { cn } from "@/lib/utils";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  const numericAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;

  const formattedPrice = numericAmount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  return (
    <span className={cn("text-sm font-semibold text-darkColor", className)}>
      {formattedPrice}
    </span>
  );
};

export default PriceFormatter;

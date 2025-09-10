import { cn } from "@/lib/utils";

// Title Component
export const Title = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "text-3xl md:text-3xl font-bold text-shop_dark_green capitalize tracking-wide font-sans",
        className
      )}
    >
      {children}
    </h2>
  );
};

export const SubTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "font-semibold text-gray-1000 font-sans",
        className
      )}
    >
      {children}
    </h3>
  );
};

// SubText Component
export const SubText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("text-gray-00 text-sm", className)}>
      {children}
    </p>
  );
};

import { cn } from "@/lib/utils";
import { Children } from "react";

export const Title = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={cn("text-3xl md:text-3xl font-bold text-shop_dark_green capitalize tracking-wide font-sans", className)}>
      {children}
    </h2>
  );
};

const Title = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={cn("text-3xl md:text-3xl font-bold text-shop_dark_green capitalize tracking-wide font-sans", className)}>
      {children}
    </h2>
  );
};


const SubText=({
  Children,className,
}:{
  Children:React.ReactNode;
  className?:string;
})=>{
  return <p className={cn("text-gray-600 text-sm",className)}>
    {Children}
  </p>
};

export { SubText };


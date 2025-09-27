import { Product } from "@/sanity.types";
import useStore from "@/store";
import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
    product: Product;
    className?: string;
}

const QuantityButtons = ({product, className}: Props) => {
    const {addItem, removeItem, getItemCount} = useStore();
    const itemCount = getItemCount(product?._id);
    const isOutOfStock = product?.stock === 0;

    const handleRemoveItem = () => {
        removeItem(product?._id);
        if(itemCount > 1){
                  toast.success(`${product?.name?.substring(0,12)} - Quantity decreased`);

        } else {
            toast.success(`${product?.name?.substring(0,12)} removed from cart`);
        }
    };

    const handleAddToCart = () =>{
    if((product?.stock as number) > itemCount){
      addItem(product);
      toast.success(`${product?.name?.substring(0,12)} - Quantity increased`,
      );
    } else {
      toast.error("Can not add more items, stock limit reached.");
    }
  };

    return(
        <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
            <Button 
                variant="outline" 
                size='icon'
                disabled={itemCount === 0 || isOutOfStock} 
                className="w-6 h-6 border-0 hover:bg-shop_dark_green/10 hover:text-shop_dark_green text-shop_dark_green hoverEffect"
                onClick={handleRemoveItem}
            >
                <Minus />
            </Button>
            <span className="font-semibold text-sm w-6 text-center text-darkColor">{itemCount}</span>
            <Button 
                variant="outline" 
                size='icon'
                disabled={isOutOfStock} 
                className="w-6 h-6 border-0 hover:bg-shop_dark_green/10 hover:text-shop_dark_green text-shop_dark_green hoverEffect"
                onClick={handleAddToCart}
            >
                <Plus />
            </Button>
        </div>
    )
}

export default QuantityButtons;
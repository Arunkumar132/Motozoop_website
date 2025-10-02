  "use client";

import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccessToCart from "@/components/NoAccessToCart";
import { Address } from "@/sanity.types";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { group } from "console";
import { Title } from "@/components/Title";
import { ShoppingBag, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ProductSideMenu from "@/components/ProductSideMenu";
import toast from "react-hot-toast";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { set } from "sanity";
import { client } from "@/sanity/lib/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@radix-ui/react-radio-group";


const CartPage = () => {
  const { deleteCartProduct, getTotalPrice, getItemCount, getSubTotalPrice, resetCart } = useStore();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address [] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query= `*[_type== "address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.log("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  },[])
  
  const handleResetCart = () => {
    const confirmReset = window.confirm("Are you sure you want to reset the cart?");
    if (confirmReset) {
      resetCart();
      toast.success("Cart has been reset");
    }
  }


  //const hasItems = Array.isArray(groupedItems)
   // ? groupedItems.length > 0
    //: Object.keys(groupedItems ?? {}).length > 0;

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems.length > 0 ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag  className="text-darkColor"/>
                <Title>Shopping Cart</Title>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {groupedItems?.map(({product})=>{
                      const itemCount=getItemCount(product._id)
                      return(
                        <div key={product?._id} className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5">
                          <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                            {product?.images && (
                              <Link href={`/product/${product?.slug?.current}`} className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group">
                                <Image
                                  src={urlFor(product?.images[0]).url()}
                                  alt="prodcutImage"
                                  width={500}
                                  height={500}
                                  loading="lazy"
                                  className={"w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"}
                                />
                              </Link>
                            )}
                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">{product?.name}</h2> 
                                <p className="text-sm capitalize">Variant:{""}<span className="font-semibold">{product?.varient}</span></p>
                                <p className="text-sm capitalize">Status:{""}<span className="font-semibold">{product?.status}</span></p>
                              </div>
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <ProductSideMenu product={product} className="relative top-0 right-0"/>
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Add to Favorites
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash 
                                        onClick={() => {
                                          deleteCartProduct(product?._id);
                                          toast.success("Product removed from cart");
                                        }}
                                        className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect" 
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold text-red-600">
                                      Delete Product
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end justify-between h-36 md:h-44 p-0.5 md:p-1">
                            <PriceFormatter amount={(product?.price as number) * itemCount} className="font-bold text-lg"/>
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      );
                    })}
                    <Button onClick={handleResetCart} className="m-5 font-semibold" variant="destructive">Reset Cart</Button>
                  </div>
                </div>
                <div>
                  <div className="lg:col-span-1">
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <h2 className="text-xl font-semibold mb-4">
                        Order Summary
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>SubTotal</span>
                          <PriceFormatter amount={getTotalPrice()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <PriceFormatter amount= {getTotalPrice() - getSubTotalPrice()} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                          <span>Total</span>
                          <PriceFormatter amount={getSubTotalPrice()}  
                          className="text-lg font-bold text-black"/>
                        </div>
                        <Button className="w-full rounded-full font-semibold tracking-wide hoverEffect" size="lg">
                          {loading ? "Processing..." : ("Proceed to Checkout")}
                        </Button>
                      </div>  
                    </div>
                    <div>
                      {addresses && (
                        <div className="bg-white rounded-md mt-5">
                          <Card>
                            <CardHeader>
                              <CardTitle>Delivery Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <RadioGroup defaultValue={addresses?.find((addr) => addr.default)?._id.toString()}>
                                {addresses.map((address) => (
                                  <div key={address._id}
                                  onClick={() => setSelectedAddress(address)}
                                  className={`flex items-center space-x-2 mb-4 cursor-pointer ${selectedAddress?._id === address?._id && "text-shop_dark_green"}`}
                                  >
                                    <RadioGroupItem value={address?._id.toString()} />
                                  </div>
                                ))}
                              </RadioGroup>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/*Order summary for mobile view*/}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                  <div className="bg-white p-4 rounded-lg border mx-4">
                    <h2 className=" ">Order Summary</h2>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccessToCart />
      )}
    </div>
  );
};

export default CartPage;

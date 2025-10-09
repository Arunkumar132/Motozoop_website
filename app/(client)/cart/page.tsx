"use client";

import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccessToCart from "@/components/NoAccessToCart";
import { Address } from "@/sanity.types";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { Title } from "@/components/Title";
import { ShoppingBag, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProductSideMenu from "@/components/ProductSideMenu";
import toast from "react-hot-toast";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCheckoutSession, Metadata } from "@/actions/createCheckoutSession";

const CartPage = () => {
  const { deleteCartProduct, getTotalPrice, getItemCount, getSubTotalPrice, resetCart } = useStore();
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser(); 

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    mobile: "",
    city: "",
    state: "",
    zip: "",
  });

  const hasItems = Array.isArray(groupedItems) && groupedItems.length > 0;

  // Fetch addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/address");
      const data: Address[] = await res.json();
      setAddresses(data);
      const defaultAddress = data.find((addr) => addr.default);
      if (defaultAddress) setSelectedAddress(defaultAddress);
      else if (data.length > 0) setSelectedAddress(data[0]);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Reset cart
  const handleResetCart = () => {
    if (window.confirm("Are you sure you want to reset the cart?")) {
      resetCart();
      toast.success("Cart has been reset");
    }
  };


  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to continue");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    setLoading(true);

    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user.fullName ?? "Unknown",
        customerEmail: user.emailAddresses?.[0]?.emailAddress ?? "Unknown",
        clerkUserId: user.id,
        address: selectedAddress,
      };

      // Create Razorpay order via backend
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: groupedItems,
          metadata,
          amount: getSubTotalPrice(), // total price here
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        name: "Motozoop",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment on the server
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const result = await verifyRes.json();
            if (result.valid) {
              toast.success(`Payment successful! ID: ${response.razorpay_payment_id}`);
              window.location.href = `/success?orderNumber=${metadata.orderNumber}`;
            } else {
              toast.error("Payment verification failed. Try again.");
            }
          } catch (err) {
            toast.error("Payment verification failed. Try again.");
          }
        },
        prefill: {
          name: metadata.customerName,
          email: metadata.customerEmail,
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function () {
            // Triggered when modal closed without payment
            toast.error("Payment canceled. Try again.");
          },
        },
        method: {
          card: true,
          netbanking: true,
          upi: true,
          wallet: false,
          emi: false,
          paylater: false,
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Payment initiation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };



  // Add address
  const addAddressToSanity = async (addressData: any) => {
    try {
      setLoading(true);
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add address");
      }

      const result = await res.json();
      setAddresses((prev) => (prev ? [result.address, ...prev] : [result.address]));
      setSelectedAddress(result.address);
      toast.success("Address added successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  // Delete address
  const deleteAddressFromSanity = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/address", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete address");
      }

      const result = await res.json();
      if (result.deleted) {
        setAddresses((prev) => prev?.filter((a) => a._id !== id) || []);
        if (selectedAddress?._id === id) setSelectedAddress(null);
        toast.success("Address deleted successfully!");
      } else {
        throw new Error(result.error || "Failed to delete address");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {hasItems ? (
            <>
              {/* ---------------- CART HEADER ---------------- */}
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>Shopping Cart</Title>
              </div>

              <div className="grid lg:grid-cols-3 md:gap-8">
                {/* ---------------- CART PRODUCTS ---------------- */}
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {groupedItems?.map((item) => {
                      const product = item.product;
                      const itemCount = item.quantity;

                      return (
                        <div
                          key={`${product._id}-${item.selectedColor}-${item.selectedStatue}`}
                          className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                            {product?.images && (
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                              >
                                <Image
                                  src={urlFor(product?.images[0]).url()}
                                  alt={product?.name ?? "Product Image"}
                                  width={500}
                                  height={500}
                                  loading="lazy"
                                  className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                />
                              </Link>
                            )}
                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">{product?.name}</h2>
                                {product?.varient && <p className="text-sm capitalize">Variant: <span className="font-semibold">{product.varient}</span></p>}
                                {item.selectedColor && <p className="text-sm capitalize">Color: <span className="font-semibold">{item.selectedColor}</span></p>}
                                {item.selectedStatue && <p className="text-sm capitalize">Statue Type: <span className="font-semibold">{item.selectedStatue}</span></p>}
                                <p className="text-sm capitalize">Status: <span className="font-semibold">{product?.status}</span></p>
                              </div>

                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <ProductSideMenu product={product} className="relative top-0 right-0"/>
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">Add to Favorites</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() => {
                                          deleteCartProduct(product._id, { selectedColor: item.selectedColor, selectedStatue: item.selectedStatue });
                                          toast.success("Product removed from cart");
                                        }}
                                        className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold text-red-600">Delete Product</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-between h-36 md:h-44 p-0.5 md:p-1">
                            <PriceFormatter amount={(product?.price as number) * itemCount} className="font-bold text-lg"/>
                            <QuantityButtons product={product} selectedColor={item.selectedColor} selectedStatue={item.selectedStatue}/>
                          </div>
                        </div>
                      );
                    })}

                    <Button onClick={handleResetCart} className="m-5 font-semibold" variant="destructive">Reset Cart</Button>
                  </div>
                </div>

                {/* ---------------- ORDER SUMMARY & ADDRESSES ---------------- */}
                <div>
                  <div className="lg:col-span-1">
                    {/* ORDER SUMMARY */}
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>SubTotal</span>
                          <PriceFormatter amount={getTotalPrice()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <PriceFormatter amount={getTotalPrice() - getSubTotalPrice()} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                          <span>Total</span>
                          <PriceFormatter amount={getSubTotalPrice()} className="text-lg font-bold text-black"/>
                        </div>
                        <div>
                          <Button className="w-full rounded-full font-semibold tracking-wide hoverEffect" 
                            size="lg" 
                            disabled={loading}
                            onClick={handleCheckout}
                          >
                            {loading ? "Processing..." : "Proceed to Checkout"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* DELIVERY ADDRESSES */}
                    {addresses && (
                      <div className="bg-white rounded-md mt-5">
                        <Card>
                          <CardHeader>
                            <CardTitle>Delivery Address</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup value={selectedAddress?._id?.toString()} onValueChange={(val) => {
                              const found = addresses.find((a) => a._id?.toString() === val);
                              if (found) setSelectedAddress(found);
                            }}>
                              {addresses.map((address) => (
                                <div key={address._id} className={`flex items-center justify-between mb-4 cursor-pointer ${selectedAddress?._id === address._id ? "text-shop_dark_green" : ""}`}>
                                  <div className="flex items-center space-x-2 flex-1" onClick={() => setSelectedAddress(address)}>
                                    <RadioGroupItem value={address._id}/>
                                    <Label className="grid gap-1.5">
                                      <span className="font-semibold">{address.name}</span>
                                      <span className="text-sm text-black/60">{address.address}, {address.city}, {address.state} {address.zip}</span>
                                      <span className="text-sm text-black/70">{address.mobile}</span>
                                    </Label>
                                  </div>

                                  <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); deleteAddressFromSanity(address._id!); }}>Delete</Button>
                                </div>
                              ))}
                            </RadioGroup>

                            {/* ADD NEW ADDRESS MODAL */}
                            <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="w-full mt-4" onClick={(e) => e.stopPropagation()}>Add New Address</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                  <DialogTitle>Add New Address</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                                  <Input placeholder="Name" value={newAddress.name} onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}/>
                                  <Input placeholder="Mobile Number" value={newAddress.mobile} onChange={(e) => setNewAddress(prev => ({ ...prev, mobile: e.target.value }))}/>
                                  <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}/>
                                  <Input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}/>
                                  <Input placeholder="Zip Code" value={newAddress.zip} onChange={(e) => setNewAddress(prev => ({ ...prev, zip: e.target.value }))}/>
                                  <Textarea placeholder="Address" value={newAddress.address} onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))} className="md:col-span-2"/>
                                </div>
                                <DialogFooter>
                                  <Button onClick={(e) => {
                                    e.stopPropagation();
                                    const { name, address, mobile, city, state, zip } = newAddress;
                                    if (!name || !address || !mobile || !city || !state || !zip) {
                                      toast.error("All fields are required!");
                                      return;
                                    }
                                    addAddressToSanity(newAddress);
                                    setNewAddress({ name:"", address:"", mobile:"", city:"", state:"", zip:"" });
                                    setIsAddressModalOpen(false);
                                  }} className="w-full">Save Address</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              </div>

               {/* MOBILE ORDER SUMMARY */}
              <div className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t p-4 md:hidden z-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Subtotal:</span>
                  <PriceFormatter amount={getTotalPrice()} className="font-semibold" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Discount:</span>
                  <PriceFormatter
                    amount={getTotalPrice() - getSubTotalPrice()}
                    className="font-semibold text-red-600"
                  />
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-bold text-lg mb-2">
                  <span>Total:</span>
                  <PriceFormatter amount={getSubTotalPrice()} className="text-black" />
                </div>
                <Button
                  className="w-full rounded-full font-semibold tracking-wide"
                  size="lg"
                  disabled={loading}
                  onClick={handleCheckout}
                >
                  {loading ? "Processing..." : "Proceed to Checkout"}
                </Button>
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

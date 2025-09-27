'use client';
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccessToCart from "@/components/NoAccessToCart";
import { Address } from "@/sanity.types";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { useState } from "react";

const CartPage = () => {
    const {
        getTotalPrice,
        getItemCount,
        resetCart,
    } = useStore();
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);
    const groupedItems = useStore((state) => state.getGroupedItems);
    const { isSignedIn } = useAuth();
    const {user} = useUser();
    //const [addresses, setAddresses] = useState<ADDRESS_QUERYResult | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<Address | null>(null);


    return(
        <div className="bg-gray-50 pb-52 md:pb-10">
            {isSignedIn ? (
                <Container>
                    {groupedItems?.length ? <><p>Products</p></> : <EmptyCart />}
                </Container>
                
            ): <NoAccessToCart />}
        </div>
    )
}

export default CartPage;
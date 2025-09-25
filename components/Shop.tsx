"use client";

import { Category } from "@/sanity.types";
import React, { useState } from "react";  
import Container from "./Container";
import { Title } from "./Title";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import { useSearchParams } from "next/navigation";

interface Props {
    categories: Category[];
}
const Shop = ({ categories }: Props) => {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] =useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    return (
        <div className="border-t">
            <Container className="mt-5">
                <div className="sticky top-0 z-10 mb-5">
                    <div className="flex items-center justify-between">
                        <Title className="text-lg uppercase tracking-wide">Get the Products as your needs</Title>
                        <button className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-shop_orange hoverEffect">Reset Filters</button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
                    <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-hidden md:min-w-64 pb-5 border-r border-r-shop_btn_dark_green/50">
                        <CategoryList
                            categories={categories}
                            selectedCatgeory={selectedCategory} 
                            setSelectedCategory= {setSelectedCategory}
                        />
                        <PriceList />
                    </div>
                    <div>Products</div>
                </div>
            </Container>
        </div>
    );
};

export default Shop;
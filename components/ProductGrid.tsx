"use client";
import { useState } from 'react';
import HomeTabBar from './HomeTabBar'; // ✅ Correct import

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState([]);

    return (
        <div>
            <HomeTabBar />
        </div>
    ); 
};

export default ProductGrid;

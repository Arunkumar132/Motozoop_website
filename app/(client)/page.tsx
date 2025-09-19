import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import ProductGrid from "@/components/ProductGrid";
import { getCategories } from "@/sanity/queries";
import React from "react";

const Home = async () => {
  const categories = await getCategories(3);

  return (
    <Container>
      <div className="bg-shop-light-pink rounded-lg">
        <HomeBanner />
      </div>
      <div className="py-10">
        <ProductGrid />
      </div>
      <HomeCategories categories={categories} />
    </Container>
  );
};

export default Home;

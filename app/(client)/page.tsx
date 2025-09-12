import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";
import React from "react";

const Home = () => {
  return (
    <Container>
      <div className="bg-shop-light-pink rounded-lg">
        <HomeBanner />
      </div>
      <div className="py-10">
        <ProductGrid />
      </div>
    </Container>
  );
};

export default Home;

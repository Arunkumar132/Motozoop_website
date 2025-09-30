// app/(client)/deal/page.tsx
import React from "react";
import { getDealProducts } from "@/sanity/queries";
import Container from "@/components/Container";
import { Title } from "@/components/Title";
import ProductList from "./ProductList"; // NEW

const DealPage = async () => {
  const products = await getDealProducts();

  return (
    <div className="py-10 bg-deal-bg">
      <Container>
        <Title className="mb-5 underline underline-offset-4 decoration-[1px] text-base uppercase tracking-wide">
          Hot Deals of the Week
        </Title>

        {/* Client wrapper renders the interactive product cards */}
        <ProductList products={products} />
      </Container>
    </div>
  );
};

export default DealPage;

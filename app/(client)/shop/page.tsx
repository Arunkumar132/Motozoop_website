import Shop from "@/components/Shop";
import { getCategories } from "@/sanity/queries";
import React from "react";

const ShopPage = async () => {
  const categories = await getCategories();

  return (
    <main>
      <Shop categories={categories} />
    </main>
  );
};

export default ShopPage;

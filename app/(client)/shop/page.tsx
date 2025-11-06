import Shop from "@/components/Shop";
import { getCategories } from "@/sanity/queries";
import { Suspense } from "react";

export default async function ShopPage() {
  const categories = await getCategories();

  return (
    <main>
      <Suspense fallback={<div className="text-center py-10">Loading shop...</div>}>
        <Shop categories={categories} />
      </Suspense>
    </main>
  );
}

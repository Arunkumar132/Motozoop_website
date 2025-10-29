import { client } from "@/lib/sanityClient";
import Image from "next/image";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stock?: number;
};

async function getProductBySlug(slug: string): Promise<Product | null> {
  return client.fetch(
    `*[_type=="product" && slug.current==$slug][0]{
      _id,
      name,
      price,
      description,
      "imageUrl": image.asset->url,
      stock
    }`,
    { slug }
  );
}

export default async function SingleProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product: Product | null = await getProductBySlug(slug);

  if (!product) return <p className="p-4">Product not found.</p>;

  const isStock = product.stock && product.stock > 0;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/products" className="text-blue-600 hover:underline mb-4 block">
        ← Back to Products
      </Link>

      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={600}
          height={400}
          className="w-full max-h-96 object-cover rounded mb-4"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center mb-4">
          No Image
        </div>
      )}

      <p className="text-lg font-semibold mb-2">
        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(product.price)}
      </p>

      <p className="mb-2">{isStock ? "In Stock" : "Out of Stock"}</p>
      <p>{product.description || "No description available."}</p>
    </div>
  );
}

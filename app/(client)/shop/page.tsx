"use client"


import React from 'react'
import { client } from '@/sanity/lib/client'

export default function ShopPage() {
  const [products, setProducts] = React.useState([])

  React.useEffect(() => {
    client.fetch(`*[_type == "product"]{_id, name, images[]{asset->{_id, url}}}`)
      .then((data) => {
        console.log(data)
        setProducts(data)
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <div>
      <h1>ShopPage</h1>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div>
          {products.map((product) => (
            <div key={product._id}>
              <h2>{product.name}</h2>
              {product.images && product.images.length > 0 && (
                <img src={product.images[0].asset.url} alt={product.name} width={200} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

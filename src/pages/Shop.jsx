import { useEffect, useState } from 'react'
import supabase from '../lib/supabase.js'

function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        setProducts(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <section>
      <div className="section-header">
        <h1>Shop</h1>
        <p>
          Browse our handmade crochet creations and find the perfect gift.
        </p>
      </div>

      {loading && <p>Loading products...</p>}

      {error && (
        <p className="message">
          Error loading products: {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p>No products available yet.</p>
      )}

      {!loading && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <article
              key={product.id}
              className="product-card"
            >
              <img
                src={product.image_url}
                alt={product.name}
              />

              <h2>{product.name}</h2>

              <p>{product.description}</p>

              <p className="price">
                ${Number(product.price).toFixed(2)}
              </p>

              <button className="primary-button">
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Shop
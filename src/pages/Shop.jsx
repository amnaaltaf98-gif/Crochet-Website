import { useEffect, useRef, useState } from 'react'
import supabase from '../lib/supabase.js'

function Shop({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const timeoutRef = useRef(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false })

        if (error) throw error

        setProducts(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function handleAdd(product) {
    onAddToCart?.(product)
    setSuccessMessage('Added to cart successfully!')

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setSuccessMessage('')
      timeoutRef.current = null
    }, 3000)
  }

  return (
    <>
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
                PKR{Number(product.price).toFixed(2)}
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() => handleAdd(product)}
              >
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      )}
    </section>

      {successMessage && (
        <div className="cart-toast">
          {successMessage}
        </div>
      )}
    </>
  )
}

export default Shop
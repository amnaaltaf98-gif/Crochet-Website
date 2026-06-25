import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../lib/supabase.js'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [productName, setProductName] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .limit(3)

      if (data?.length) {
        setFeaturedProducts(data)
        setProductName(data[0].name)
      }
    }

    loadProducts()
  }, [])

  async function handleOrder(event) {
    event.preventDefault()

    setLoading(true)
    setMessage('')

    const { error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: customerName,
          product_name: productName,
          message: note,
        },
      ])

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Order submitted successfully!')

    setCustomerName('')
    setNote('')
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Little Loop Co.</p>

          <h1>Handmade Crochet Creations</h1>

          <p>
            Discover crochet flowers, bouquets,
            charms and custom handmade gifts.
          </p>

          <div className="hero-cta">
            <Link
              to="/shop"
              className="button primary-button"
            >
              Shop Now
            </Link>

            <Link
              to="/signup"
              className="button outline-button"
            >
              Create Account
            </Link>
          </div>

          <div className="hero-badges">
            <span className="badge">
              Crochet Flowers
            </span>

            <span className="badge">
              Bouquets
            </span>

            <span className="badge">
              Custom Orders
            </span>
          </div>
        </div>

        {featuredProducts[0] && (
          <img
            src={featuredProducts[0].image_url}
            alt={featuredProducts[0].name}
            className="hero-image"
          />
        )}
      </section>

      <section>
        <div className="section-header">
          <h2>Featured Products</h2>

          <p>
            Beautiful handmade pieces from our
            latest collection.
          </p>
        </div>

        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <article
              key={product.id}
              className="product-card"
            >
              <img
                src={product.image_url}
                alt={product.name}
              />

              <h3>{product.name}</h3>

              <p>{product.description}</p>

              <p className="price">
                PKR{Number(product.price).toFixed(2)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="custom-order-section">
        <div className="section-header">
          <h2>Custom Order Request</h2>

          <p>
            Tell us what you'd like and we'll
            create it just for you.
          </p>
        </div>

        <form
          onSubmit={handleOrder}
          className="custom-order-form"
        >
          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
            required
          />

          <select
            value={productName}
            onChange={(e) =>
              setProductName(e.target.value)
            }
          >
            {featuredProducts.map((product) => (
              <option
                key={product.id}
                value={product.name}
              >
                {product.name}
              </option>
            ))}
          </select>

          <textarea
            rows="5"
            placeholder="Describe your custom order..."
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
          />

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? 'Submitting...'
              : 'Submit Order'}
          </button>

          {message && (
            <p className="message">
              {message}
            </p>
          )}
        </form>
      </section>
    </>
  )
}

export default Home
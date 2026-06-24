import { useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../lib/supabase.js'

const featuredProducts = [
  {
    id: 1,
    name: 'Sunflower Bouquet',
    price: 25.0,
    description: 'Handmade crochet sunflower bouquet',
    image: new URL('../assets/products/Tulip1.jpg', import.meta.url).href,
  },
  {
    id: 2,
    name: 'Rose Charm',
    price: 12.5,
    description: 'Delicate rose charm for bags and keys',
    image: new URL('../assets/products/Rose.jpg', import.meta.url).href,
  },
  {
    id: 3,
    name: 'Bouquet Charm Set',
    price: 18.0,
    description: 'Three-piece bouquet charm collection',
    image: new URL('../assets/products/Bouquetcharm1.png', import.meta.url).href,
  },
]

function Home() {
  const [customerName, setCustomerName] = useState('')
  const [productName, setProductName] = useState(featuredProducts[0].name)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')

  async function handleOrder(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.from('orders').insert([
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

    setMessage('Custom order submitted! We will contact you soon.')
    setCustomerName('')
    setNote('')
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Little Loop Co.</p>
          <h1>Handmade With Love</h1>
          <p>Discover crochet flowers, bouquets, charms, and custom orders made with care.</p>

          <div className="hero-cta">
            <Link to="/shop" className="button primary-button">Shop Now</Link>
            <Link to="/signup" className="button outline-button">Create Account</Link>
          </div>

          <div className="hero-badges">
            <span className="badge">Crochet Flowers</span>
            <span className="badge">Crochet Bouquets</span>
            <span className="badge">Custom Orders</span>
          </div>
        </div>

        <img src={featuredProducts[0].image} alt="Crochet product" className="hero-image" />
      </section>

      <section>
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Beautiful handmade pieces from our latest collection.</p>
        </div>

        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <article key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p className="price">${product.price.toFixed(2)}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2>Custom Order Form</h2>
          <p>Submit a custom request and we'll make it specially for you.</p>
        </div>

        <form onSubmit={handleOrder} className="order-form">
          <label>
            Your name
            <input
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              required
            />
          </label>

          <label>
            Product
            <select value={productName} onChange={(event) => setProductName(event.target.value)}>
              {featuredProducts.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Details
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              placeholder="Tell us what you'd like to customize..."
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Sending order…' : 'Place custom order'}
          </button>

          {message && <p className="message">{message}</p>}
        </form>
      </section>
    </>
  )
}

export default Home

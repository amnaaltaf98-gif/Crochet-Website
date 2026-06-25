import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../lib/supabase.js'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [visibleCount, setVisibleCount] = useState(4)
  const [orderOpen, setOrderOpen] = useState(false)

  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [productName, setProductName] = useState('')
  const [budget, setBudget] = useState('')
  const [colors, setColors] = useState('')
  const [note, setNote] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setFeaturedProducts(data)

        if (data.length > 0) {
          setProductName(data[0].name)
        }
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
          email,
          phone,
          product_name: productName,
          budget,
          colors,
          message: note,
        },
      ])

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Custom order submitted successfully!')

    setCustomerName('')
    setEmail('')
    setPhone('')
    setBudget('')
    setColors('')
    setNote('')
  }

  return (
    <>
      {/* HERO */}

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            Hanked by NA
          </p>

          <h1>
            Handmade Crochet
            Creations
          </h1>

          <p>
            Artisan bags, charms, and florals—hooked to perfection.
          </p>

          <div className="hero-cta">
            <Link
              to="/shop"
              className="button primary-button hero-shop-btn"
            >
              Shop Collection
            </Link>
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

      {/* FEATURED PRODUCTS */}

      <section>
        <div className="section-header section-card">
          <div>
            <h2>
              Featured Products
            </h2>

            <p>
              Browse our latest handmade crochet creations.
            </p>
          </div>
          <span className="section-highlight">
            Discover pieces made with care and style.
          </span>
        </div>

        <div className="featured-scroll">
          {featuredProducts
            .slice(0, visibleCount)
            .map((product) => (
              <Link
                key={product.id}
                to={`/shop#product-${product.id}`}
                className="product-link"
              >
                <article className="product-card">
                  <img
                    src={product.image_url}
                    alt={product.name}
                  />

                  <h3>{product.name}</h3>

                  <p>
                    {product.description}
                  </p>

                  <p className="price">
                    PKR{' '}
                    {Number(
                      product.price
                    ).toLocaleString()}
                  </p>
                </article>
              </Link>
            ))}
        </div>

        {visibleCount <
          featuredProducts.length && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '24px',
            }}
          >
            <button
              className="primary-button"
              onClick={() =>
                setVisibleCount(
                  visibleCount + 4
                )
              }
            >
              Show More
            </button>
          </div>
        )}
      </section>

      {/* CUSTOM ORDER */}

      <section className="custom-order-section">
        <div className="custom-order-header">
          <div className="section-header">
            <h2>
              Custom Order Request
            </h2>

            <p>
              Have a unique idea? Let's create something special just for you.
            </p>
          </div>

          <button
            type="button"
            className="outline-button custom-order-toggle"
            onClick={() => setOrderOpen((open) => !open)}
          >
            {orderOpen ? 'Hide Request' : 'Request Custom Order'}
          </button>
        </div>

        <div className={`custom-order-panel ${orderOpen ? 'open' : ''}`}>
          <form
            onSubmit={handleOrder}
            className="custom-order-form"
          >
          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <select
            value={productName}
            onChange={(e) =>
              setProductName(
                e.target.value
              )
            }
          >
            {featuredProducts.map(
              (product) => (
                <option
                  key={product.id}
                  value={product.name}
                >
                  {product.name}
                </option>
              )
            )}
          </select>

          <input
            type="number"
            placeholder="Budget (PKR)"
            value={budget}
            onChange={(e) =>
              setBudget(
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="Preferred Colors"
            value={colors}
            onChange={(e) =>
              setColors(
                e.target.value
              )
            }
          />

          <textarea
            rows="5"
            placeholder="Describe your custom order..."
            value={note}
            onChange={(e) =>
              setNote(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? 'Submitting...'
              : 'Submit Request'}
          </button>

          {message && (
            <p className="message">
              {message}
            </p>
          )}
          </form>
        </div>
      </section>
    </>
  )
}

export default Home
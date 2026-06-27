import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import logo from './assets/logo.png'
import supabase from './lib/supabase.js'

import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import About from './pages/About.jsx'
import Cart from './pages/Cart.jsx'
import Reviews from './pages/Reviews.jsx'

import './App.css'

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^-\u007F]/g, '')
    .replace(/[^a-z0-9-]/g, '')
}

function App() {
  const [cartItems, setCartItems] = useState([])
  const [shopCategories, setShopCategories] = useState([])
  const [shopPreviews, setShopPreviews] = useState({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function loadShopCategories() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id,name,category,image_url')
          .order('id', { ascending: false })

        if (error) throw error

        const categories = Array.from(
          new Set(data.map((product) => product.category || 'Uncategorized')),
        ).sort()

        const previews = categories.reduce((acc, category) => {
          const preview = data.find(
            (product) => (product.category || 'Uncategorized') === category,
          )
          if (preview) {
            acc[category] = preview
          }
          return acc
        }, {})

        setShopCategories(categories)
        setShopPreviews(previews)
      } catch (err) {
        console.error('Error loading shop categories:', err)
      }
    }

    loadShopCategories()
  }, [])

  function handleAddToCart(product) {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id)

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...current, { ...product, quantity: 1 }]
    })
  }

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.price || 0),
    0,
  )

  const handleClearCart = () => {
    setCartItems([])
  }

  return (
    <BrowserRouter>
      <div className="main-layout">
        <header className="site-header">
          <Link to="/" className="brand">
            <img
              src={logo}
              alt="Hanked by NA Logo"
              className="logo"
            />

            <div className="brand-copy">
              <p className="eyebrow">Hanked by NA</p>
              <h2>Every Stitch Has a Story</h2>
            </div>
          </Link>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`site-nav-wrapper ${mobileMenuOpen ? 'open' : ''}`}>
            <ul className="site-nav">
              <li>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              </li>

              <li className="nav-shop-menu">
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>

                {shopCategories.length > 0 && (
                  <div className="nav-category-popover">
                    <div className="hero-category-grid">
                      {shopCategories.map((category) => (
                        <Link
                          key={category}
                          to={`/shop#category-${slugify(category)}`}
                          className="hero-category-card"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <img
                            src={shopPreviews[category]?.image_url}
                            alt={category}
                          />
                          <span>{category}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              <li>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
              </li>

              <li>
                <Link to="/reviews" onClick={() => setMobileMenuOpen(false)}>Reviews</Link>
              </li>

              <li>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Cart</Link>
              </li>
            </ul>
          </nav>

          <div className="cart-summary">
            <span>{cartCount} item{cartCount === 1 ? '' : 's'}</span>
            <strong>PKR {cartTotal.toFixed(2)}</strong>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/shop"
              element={<Shop onAddToCart={handleAddToCart} />}
            />

            <Route path="/about" element={<About />} />

            <Route path="/reviews" element={<Reviews />} />

            <Route
              path="/cart"
              element={<Cart cartItems={cartItems} onOrderPlaced={handleClearCart} />}
            />
          </Routes>
        </main>

        <footer
          style={{
            marginTop: '80px',
            padding: '32px 0',
            textAlign: 'center',
            color: '#2D3A47',
            borderTop: '1px solid rgba(45,58,71,.15)',
          }}
        >
          <p>
            © {new Date().getFullYear()} Hanked by NA
          </p>

          <p>
            Artisan bags, charms, and florals—hooked to perfection.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
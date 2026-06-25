import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import logo from './assets/logo.png'

import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import About from './pages/About.jsx'

import './App.css'

function App() {
  const [cartItems, setCartItems] = useState([])

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

  return (
    <BrowserRouter>
      <div className="main-layout">
        <header className="site-header">
          <Link to="/" className="brand">
            <img
              src={logo}
              alt="Little Loop Co. Logo"
              className="logo"
            />

            <div className="brand-copy">
              <p className="eyebrow">Little Loop Co.</p>
              <h2>Handmade With Love</h2>
            </div>
          </Link>

          <nav>
            <ul className="site-nav">
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/shop">Shop</Link>
              </li>

              <li>
                <Link to="/about">About</Link>
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
          </Routes>
        </main>

        <footer
          style={{
            marginTop: '80px',
            padding: '32px 0',
            textAlign: 'center',
            color: '#324A3C',
            borderTop: '1px solid rgba(50,74,60,.15)',
          }}
        >
          <p>
            © {new Date().getFullYear()} Little Loop Co.
          </p>

          <p>
            Handmade crochet flowers, bouquets and custom creations.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
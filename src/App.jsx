import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import logo from './assets/logo.png'

import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Account from './pages/Account.jsx'

import './App.css'

function App() {
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

              <li>
                <Link to="/login">Login</Link>
              </li>

              <li>
                <Link to="/signup">Signup</Link>
              </li>

              <li>
                <Link to="/account">Account</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/shop" element={<Shop />} />

            <Route path="/about" element={<About />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/account" element={<Account />} />
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
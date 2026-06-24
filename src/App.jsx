import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import logo from './assets/logo.png'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Account from './pages/Account.jsx'
import About from './pages/About.jsx'

function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <div className="brand">
          <img src={logo} alt="Little Loop Co. logo" className="logo" />
          <div className="brand-copy">
            <p className="eyebrow">Little Loop Co.</p>
            <p>Handmade With Love</p>
          </div>
        </div>

        <nav>
          <ul className="site-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/account">Account</Link></li>
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
    </BrowserRouter>
  )
}

export default App

import { useState } from 'react'
import emailjs from '@emailjs/browser'
import './Cart.css'

// Easy to edit: delivery charge (in PKR) per city.
// Add more cities here any time, or change the numbers.
const DELIVERY_RATES = {
  Karachi: 200,
  Lahore: 350,
  Islamabad: 350,
  Other: 450,
}

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

function Cart({ cartItems, onOrderPlaced }) {
  const [step, setStep] = useState('cart') // 'cart' | 'checkout' | 'success'
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Karachi',
  })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.price || 0),
    0,
  )
  const deliveryCharge = DELIVERY_RATES[form.city] ?? DELIVERY_RATES.Other
  const grandTotal = itemsTotal + deliveryCharge

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')

    const orderItemsText = cartItems
      .map(
        (item) =>
          `${item.name} x${item.quantity} - PKR ${(
            item.quantity * Number(item.price || 0)
          ).toFixed(2)}`,
      )
      .join('\n')

    const templateParams = {
      customer_name: form.name,
      customer_phone: form.phone,
      customer_address: form.address,
      customer_city: form.city,
      order_items: orderItemsText,
      delivery_charge: `PKR ${deliveryCharge.toFixed(2)}`,
      order_total: `PKR ${grandTotal.toFixed(2)}`,
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
        publicKey: EMAILJS_PUBLIC_KEY,
      })
      onOrderPlaced?.()
      setStep('success')
    } catch (err) {
      console.error(err)
      setError(
        'Something went wrong sending your order. Please try again, or message us directly on WhatsApp.',
      )
    } finally {
      setSending(false)
    }
  }

  // ---- Step 1: Cart view ----
  if (step === 'cart') {
    return (
      <section>
        <div className="section-header">
          <h1>Your Cart</h1>
          <p>Review the products you added and proceed when ready.</p>
        </div>

        {cartItems.length === 0 ? (
          <p>Your cart is empty. Add products from the shop to see them here.</p>
        ) : (
          <>
            <div className="cart-table">
              <div className="cart-row cart-row-header">
                <span>Product</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Subtotal</span>
              </div>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-row">
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                  <span>PKR {Number(item.price).toFixed(2)}</span>
                  <span>PKR {(item.quantity * Number(item.price || 0)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="cart-details">
              <p className="cart-note">Delivery charges will be added at checkout based on your city.</p>
              <div className="cart-total">
                <span>Total</span>
                <strong>PKR {itemsTotal.toFixed(2)}</strong>
              </div>
              <button className="primary-button" onClick={() => setStep('checkout')}>
                Proceed with Order
              </button>
            </div>
          </>
        )}
      </section>
    )
  }

  // ---- Step 2: Checkout form ----
  if (step === 'checkout') {
    return (
      <section>
        <div className="section-header">
          <h1>Checkout</h1>
          <p>Tell us where to deliver your order.</p>
        </div>

        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleFormChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleFormChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <select id="city" name="city" value={form.city} onChange={handleFormChange}>
              {Object.keys(DELIVERY_RATES).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <textarea id="address" name="address" rows={3} value={form.address} onChange={handleFormChange} required />
          </div>

          <div className="order-summary">
            <div className="order-summary-row">
              <span>Items Total</span>
              <span>PKR {itemsTotal.toFixed(2)}</span>
            </div>
            <div className="order-summary-row">
              <span>Delivery ({form.city})</span>
              <span>PKR {deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="order-summary-row order-summary-total">
              <span>Total</span>
              <strong>PKR {grandTotal.toFixed(2)}</strong>
            </div>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => setStep('cart')} disabled={sending}>
              Back to Cart
            </button>
            <button type="submit" className="primary-button" disabled={sending}>
              {sending ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </section>
    )
  }

  // ---- Step 3: Success ----
  return (
    <section>
      <div className="section-header">
        <h1>Order Placed!</h1>
        <p>
          Thank you, {form.name}. Your order has been sent and we'll reach out on {form.phone} to confirm.
        </p>
      </div>
    </section>
  )
}

export default Cart
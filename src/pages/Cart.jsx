function Cart({ cartItems }) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.price || 0),
    0,
  )

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
            <p className="cart-note">Delivery charges will be added later.</p>
            <div className="cart-total">
              <span>Total</span>
              <strong>PKR {total.toFixed(2)}</strong>
            </div>
            <button className="primary-button">Proceed with Order</button>
          </div>
        </>
      )}
    </section>
  )
}

export default Cart

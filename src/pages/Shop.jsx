import { useEffect, useState } from 'react'
import supabase from '../lib/supabase.js'

const localImages = {
  'Sunflower Bouquet': new URL('../assets/products/Tulip1.jpg', import.meta.url).href,
  'Rose Charm': new URL('../assets/products/Rose.jpg', import.meta.url).href,
  'Bouquet Charm Set': new URL('../assets/products/Bouquetcharm1.png', import.meta.url).href,
  'Tulip Charm': new URL('../assets/products/Bouquetcharm2.png', import.meta.url).href,
}

const fallbackProducts = [
  {
    id: 1,
    name: 'Sunflower Bouquet',
    price: 25.0,
    description: 'Handmade crochet sunflower bouquet',
    image_url: localImages['Sunflower Bouquet'],
  },
  {
    id: 2,
    name: 'Rose Charm',
    price: 12.5,
    description: 'Delicate rose charm for bags and keys',
    image_url: localImages['Rose Charm'],
  },
  {
    id: 3,
    name: 'Bouquet Charm Set',
    price: 18.0,
    description: 'Three-piece bouquet charm collection',
    image_url: localImages['Bouquet Charm Set'],
  },
]

function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase.from('products').select('*')

      if (error) {
        setError(error.message)
        setProducts(fallbackProducts)
      } else if (data?.length) {
        setProducts(data)
      } else {
        setProducts(fallbackProducts)
      }

      setLoading(false)
    }

    loadProducts()
  }, [])

  return (
    <section>
      <div className="section-header">
        <h1>Shop</h1>
        <p>Browse our crochet products and find the perfect handmade item.</p>
      </div>

      {error && <p className="message">Unable to load products. Showing local favorites instead.</p>}

      {loading ? (
        <p>Loading products…</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const imageSrc = product.image_url || localImages[product.name] || fallbackProducts[0].image_url
            const price = typeof product.price === 'number' ? product.price : Number(product.price)

            return (
              <article key={product.id} className="product-card">
                <img src={imageSrc} alt={product.name} />
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p className="price">${isNaN(price) ? '0.00' : price.toFixed(2)}</p>
                <button className="primary-button">Add to cart</button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Shop

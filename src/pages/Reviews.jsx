import { useEffect, useState } from 'react'
import supabase from '../lib/supabase.js'

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    feedback: '',
    rating: 5,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error('Error loading reviews:', err)
      setError('Failed to load reviews. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.customer_name || !formData.email || !formData.feedback) {
      setError('Please fill in all fields.')
      setSubmitting(false)
      return
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            customer_name: formData.customer_name,
            email: formData.email,
            feedback: formData.feedback,
            rating: formData.rating,
          },
        ])

      if (error) throw error

      setSubmitSuccess(true)
      setFormData({
        customer_name: '',
        email: '',
        feedback: '',
        rating: 5,
      })

      setTimeout(() => {
        setSubmitSuccess(false)
        loadReviews()
      }, 2000)
    } catch (err) {
      console.error('Error submitting review:', err)
      setError('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function renderStars(rating) {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <>
      <section>
        <div className="page-intro-card">
          <h1>Customer Reviews</h1>
          <p>
            Read what our customers say about their handmade crochet experiences.
            Your feedback helps us create better products and services.
          </p>
        </div>
      </section>

      {/* REVIEW SUBMISSION FORM */}
      <section>
        <div className="section-header">
          <h2>Share Your Experience</h2>
          <p>Have you purchased from us? We'd love to hear your thoughts!</p>
        </div>

        <div className="review-form-card">
          {submitSuccess && (
            <div className="success-message">
              Thank you for your review! It has been submitted successfully.
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleFormChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating *</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-button ${
                      star <= formData.rating ? 'selected' : ''
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, rating: star })
                    }
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="feedback">Your Review *</label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleFormChange}
                placeholder="Share your experience with our products..."
                rows="5"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </section>

      {/* REVIEWS DISPLAY */}
      <section>
        <div className="section-header">
          <h2>What Our Customers Say</h2>
          {reviews.length > 0 && (
            <p>
              {reviews.length} review{reviews.length !== 1 ? 's' : ''} from
              happy customers
            </p>
          )}
        </div>

        {loading ? (
          <div className="loading-message">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="empty-message">
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <article key={index} className="review-card">
                <div className="review-header">
                  <div>
                    <h3>{review.customer_name}</h3>
                    {renderStars(review.rating)}
                  </div>
                </div>

                <p className="review-text">{review.feedback}</p>

                <p className="review-email">{review.email}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default Reviews

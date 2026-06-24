import { useEffect, useState } from 'react'
import supabase from '../lib/supabase.js'

function Account() {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
    }

    loadSession()
  }, [])

  async function handleSignOut() {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setUser(null)
    setMessage('You have been signed out.')
  }

  return (
    <section>
      <h1>Account</h1>
      <p>Manage your logged-in session and orders.</p>

      {user ? (
        <div className="account-card">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
          <button onClick={handleSignOut} disabled={loading}>
            {loading ? 'Signing out…' : 'Logout'}
          </button>
          {message && <p className="message">{message}</p>}
        </div>
      ) : (
        <p>Please log in to view your account details.</p>
      )}
    </section>
  )
}

export default Account

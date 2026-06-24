import { useState } from 'react'
import supabase from '../lib/supabase.js'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    if (data?.user) {
      setMessage('Signup successful! Check your email for confirmation steps.')
      setEmail('')
      setPassword('')
    } else {
      setMessage('Signup request sent. Please check your email.')
    }
  }

  return (
    <section>
      <h1>Signup</h1>
      <p>Create a new account to save favorites and place custom orders.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up…' : 'Sign up'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </section>
  )
}

export default Signup

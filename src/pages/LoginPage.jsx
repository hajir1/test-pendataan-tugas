import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/authContext'

export function LoginPage() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const from = location.state?.from || '/'

  if (session?.user) {
    return <Navigate to={from} replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Masuk ke TaskFlow</h1>
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input name="password" type="password" minLength={8} value={form.password} onChange={handleChange} required />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="button primary" disabled={loading}>
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>

        <p className="auth-switch">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </p>
      </section>
    </main>
  )
}

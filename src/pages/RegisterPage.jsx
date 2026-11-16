import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/authContext'

export function RegisterPage() {
  const { session, register } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (session?.user) {
    return <Navigate to="/" replace />
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
      await register(form)
    } catch (err) {
      setError(err.message || 'Registrasi gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Buat akun TaskFlow</h1>
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
            {loading ? 'Memuat...' : 'Daftar'}
          </button>
        </form>

        <p className="auth-switch">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
      </section>
    </main>
  )
}

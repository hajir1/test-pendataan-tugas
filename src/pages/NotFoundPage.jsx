import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card not-found">
        <h1>404</h1>
        <p>Halaman yang Anda cari tidak ditemukan.</p>
        <Link to="/" className="button primary">
          Kembali ke dashboard
        </Link>
      </section>
    </main>
  )
}

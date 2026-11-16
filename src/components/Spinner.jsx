export function Spinner({ label = 'Memuat...' }) {
  return (
    <div className="page-state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}

import { STATUS_LABELS } from '../../lib/taskUtils'

export function TaskSummary({ summary = {} }) {
  return (
    <div className="summary-grid" aria-label="Ringkasan tugas">
      {Object.entries(STATUS_LABELS).map(([status, label]) => (
        <div key={status} className="summary-card">
          <span>{label}</span>
          <strong>{summary[status] ?? 0}</strong>
        </div>
      ))}
    </div>
  )
}

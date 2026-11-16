import { PRIORITY_LABELS, STATUS_LABELS, isOverdue } from '../../lib/taskUtils'

export function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const overdue = isOverdue(task)

  return (
    <article className="task-card" aria-label={`Tugas ${task.title}`}>
      <div className="task-card-header">
        <div>
          <h3>{task.title}</h3>
          {overdue ? <span className="badge danger">Terlambat</span> : null}
        </div>
        <div className="task-actions">
          <button type="button" className="icon-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
            Edit
          </button>
          <button type="button" className="icon-button danger" onClick={() => onDelete(task)} aria-label={`Hapus ${task.title}`}>
            Hapus
          </button>
        </div>
      </div>

      {task.description ? <p className="task-description">{task.description}</p> : null}

      <div className="task-meta">
        <span className="badge">{PRIORITY_LABELS[task.priority] || task.priority}</span>
        <span className="badge neutral">{STATUS_LABELS[task.status] || task.status}</span>
        {task.due_date ? <span className="meta-date">Tenggat: {task.due_date}</span> : null}
      </div>

      <div className="status-selector" aria-label="Ubah status tugas">
        {['todo', 'in_progress', 'done'].map((status) => (
          <button
            key={status}
            type="button"
            className={task.status === status ? 'status-button active' : 'status-button'}
            onClick={() => onStatusChange(task, status)}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>
    </article>
  )
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div className="modal-card">
        <h3 id="confirm-dialog-title">{title}</h3>
        <p>{message}</p>
        <div className="form-actions">
          <button type="button" className="button secondary" onClick={onCancel}>
            Batal
          </button>
          <button type="button" className="button danger" onClick={onConfirm}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state" data-testid="empty-state">
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action ? <button type="button" onClick={action.onClick}>{action.label}</button> : null}
    </div>
  )
}

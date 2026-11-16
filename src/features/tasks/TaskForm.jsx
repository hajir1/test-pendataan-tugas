import { useState } from 'react'

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
  status: 'todo',
}

export function TaskForm({ initialValue, onSubmit, onCancel, submitLabel = 'Simpan' }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...initialValue }))
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.title.trim()) {
      nextErrors.title = 'Judul tugas wajib diisi.'
    } else if (form.title.trim().length > 120) {
      nextErrors.title = 'Judul maksimal 120 karakter.'
    }

    if (form.description && form.description.length > 1000) {
      nextErrors.description = 'Deskripsi maksimal 1000 karakter.'
    }

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    })
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="field-row">
        <label>
          Judul
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={120}
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? <small className="field-error">{errors.title}</small> : null}
        </label>
      </div>

      <label>
        Deskripsi
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          maxLength={1000}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description ? <small className="field-error">{errors.description}</small> : null}
      </label>

      <div className="field-row two-columns">
        <label>
          Prioritas
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
          </select>
        </label>

        <label>
          Tenggat
          <input name="due_date" type="date" value={form.due_date} onChange={handleChange} />
        </label>
      </div>

      {initialValue ? (
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="todo">Belum</option>
            <option value="in_progress">Dikerjakan</option>
            <option value="done">Selesai</option>
          </select>
        </label>
      ) : null}

      <div className="form-actions">
        <button type="button" className="button secondary" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="button primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

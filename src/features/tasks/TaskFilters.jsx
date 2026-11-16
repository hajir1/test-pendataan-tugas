export function TaskFilters({ value, onChange }) {
  const handleChange = (event) => {
    onChange({ ...value, [event.target.name]: event.target.value })
  }

  return (
    <div className="filters">
      <label>
        Status
        <select name="status" value={value.status} onChange={handleChange}>
          <option value="all">Semua</option>
          <option value="todo">Belum</option>
          <option value="in_progress">Dikerjakan</option>
          <option value="done">Selesai</option>
        </select>
      </label>

      <label>
        Prioritas
        <select name="priority" value={value.priority} onChange={handleChange}>
          <option value="all">Semua</option>
          <option value="low">Rendah</option>
          <option value="medium">Sedang</option>
          <option value="high">Tinggi</option>
        </select>
      </label>

      <label>
        Cari tugas
        <input
          type="search"
          name="search"
          value={value.search}
          onChange={handleChange}
          placeholder="Judul atau deskripsi"
        />
      </label>
    </div>
  )
}

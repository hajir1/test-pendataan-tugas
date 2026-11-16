import { describe, expect, it } from 'vitest'
import { filterTasks, getTaskSummary, isOverdue, sortTasks } from '../lib/taskUtils'

describe('taskUtils', () => {
  it('mengurutkan tugas sesuai status, tenggat, dan tanggal pembuatan', () => {
    const tasks = [
      { id: '2', status: 'done', priority: 'high', due_date: '2026-11-10', created_at: '2026-11-08T00:00:00Z' },
      { id: '1', status: 'todo', priority: 'medium', due_date: '2026-11-12', created_at: '2026-11-09T00:00:00Z' },
      { id: '3', status: 'todo', priority: 'low', due_date: '2026-11-11', created_at: '2026-11-07T00:00:00Z' },
    ]

    expect(sortTasks(tasks).map((task) => task.id)).toEqual(['3', '1', '2'])
  })

  it('menggabungkan filter status, prioritas, dan pencarian judul', () => {
    const tasks = [
      { id: 'a', status: 'todo', priority: 'high', title: 'Belajar React', description: 'Mempelajari hook' },
      { id: 'b', status: 'done', priority: 'high', title: 'Menulis laporan', description: 'Laporan mingguan' },
      { id: 'c', status: 'todo', priority: 'low', title: 'Bersihkan rumah', description: 'Mencuci piring' },
    ]

    const result = filterTasks(tasks, { status: 'todo', priority: 'high', search: 'react' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('mendeteksi tugas yang terlambat', () => {
    const tasks = [
      { status: 'todo', due_date: '2026-11-01' },
      { status: 'done', due_date: '2026-11-01' },
      { status: 'in_progress', due_date: '2099-12-31' },
    ]

    expect(isOverdue(tasks[0])).toBe(true)
    expect(isOverdue(tasks[1])).toBe(false)
    expect(isOverdue(tasks[2])).toBe(false)
  })

  it('menghitung ringkasan tugas', () => {
    const tasks = [
      { status: 'todo' },
      { status: 'todo' },
      { status: 'in_progress' },
      { status: 'done' },
    ]

    expect(getTaskSummary(tasks)).toEqual({ all: 4, todo: 2, in_progress: 1, done: 1 })
  })
})

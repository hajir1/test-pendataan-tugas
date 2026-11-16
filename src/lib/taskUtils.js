export const STATUS_LABELS = {
  todo: 'Belum',
  in_progress: 'Dikerjakan',
  done: 'Selesai',
}

export const PRIORITY_LABELS = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
}

export function normalizeTask(task) {
  return {
    ...task,
    status: task.status || 'todo',
    priority: task.priority || 'medium',
    title: String(task.title || '').trim(),
    description: task.description || '',
  }
}

export function sortTasks(tasks = []) {
  return [...tasks].sort((a, b) => {
    const statusWeight = { todo: 0, in_progress: 1, done: 2 }
    const statusDifference = (statusWeight[a.status] ?? 99) - (statusWeight[b.status] ?? 99)

    if (statusDifference !== 0) {
      return statusDifference
    }

    const dueA = a.due_date ? new Date(`${a.due_date}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER
    const dueB = b.due_date ? new Date(`${b.due_date}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER
    if (dueA !== dueB) {
      return dueA - dueB
    }

    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  })
}

export function filterTasks(tasks = [], filters = {}) {
  const status = filters.status || 'all'
  const priority = filters.priority || 'all'
  const search = (filters.search || '').trim().toLowerCase()

  return tasks.filter((task) => {
    const matchesStatus = status === 'all' || task.status === status
    const matchesPriority = priority === 'all' || task.priority === priority
    const matchesSearch =
      search.length === 0 || task.title?.toLowerCase().includes(search) || task.description?.toLowerCase().includes(search)

    return matchesStatus && matchesPriority && matchesSearch
  })
}

export function isOverdue(task) {
  if (!task?.due_date || task.status === 'done') {
    return false
  }

  const dueDate = new Date(`${task.due_date}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return dueDate < today
}

export function getTaskSummary(tasks = []) {
  return {
    all: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    in_progress: tasks.filter((task) => task.status === 'in_progress').length,
    done: tasks.filter((task) => task.status === 'done').length,
  }
}

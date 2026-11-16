import { normalizeTask, sortTasks } from '../../lib/taskUtils'

const TASKS_KEY = 'taskflow_tasks'

function readTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

function buildTask(task, userId) {
  const baseTask = normalizeTask(task)
  const now = new Date().toISOString()

  return {
    id: baseTask.id || crypto.randomUUID(),
    user_id: userId,
    title: baseTask.title,
    description: baseTask.description,
    status: baseTask.status,
    priority: baseTask.priority,
    due_date: baseTask.due_date || null,
    created_at: baseTask.created_at || now,
    updated_at: now,
  }
}

export async function listTasks(userId) {
  const tasks = readTasks().filter((task) => task.user_id === userId)
  return sortTasks(tasks)
}

export async function createTask(taskData, userId) {
  const tasks = readTasks()
  const nextTask = buildTask(taskData, userId)
  const nextTasks = [...tasks, nextTask]
  writeTasks(nextTasks)
  return nextTask
}

export async function updateTask(taskId, changes, userId) {
  const tasks = readTasks()
  const index = tasks.findIndex((task) => task.id === taskId && task.user_id === userId)

  if (index === -1) {
    throw new Error('Tugas tidak ditemukan.')
  }

  const updated = {
    ...tasks[index],
    ...normalizeTask({ ...tasks[index], ...changes }),
    updated_at: new Date().toISOString(),
  }

  tasks[index] = updated
  writeTasks(tasks)
  return updated
}

export async function deleteTask(taskId, userId) {
  const tasks = readTasks().filter((task) => !(task.id === taskId && task.user_id === userId))
  writeTasks(tasks)
}

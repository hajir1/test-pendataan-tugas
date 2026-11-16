import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../features/auth/authContext'
import { ConfirmDialog } from '../features/tasks/ConfirmDialog'
import { TaskCard } from '../features/tasks/TaskCard'
import { TaskFilters } from '../features/tasks/TaskFilters'
import { TaskForm } from '../features/tasks/TaskForm'
import { TaskSummary } from '../features/tasks/TaskSummary'
import { createTask, deleteTask, listTasks, updateTask } from '../features/tasks/tasksApi'
import { EmptyState } from '../components/EmptyState'
import { Spinner } from '../components/Spinner'
import { Toast } from '../components/Toast'
import { filterTasks, getTaskSummary, sortTasks } from '../lib/taskUtils'

const emptyFilters = { status: 'all', priority: 'all', search: '' }

export function DashboardPage() {
  const { session, logout } = useAuth()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState(emptyFilters)
  const [showCreateForm, setShowCreateForm] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [toast, setToast] = useState('')

  const { data: tasks = [], isLoading, isError, error } = useQuery({
    queryKey: ['tasks', session?.user?.id],
    queryFn: () => listTasks(session.user.id),
    enabled: Boolean(session?.user?.id),
  })

  const filteredTasks = useMemo(() => {
    const visible = filterTasks(sortTasks(tasks), filters)
    return visible
  }, [filters, tasks])

  const summary = useMemo(() => getTaskSummary(tasks), [tasks])

  const createMutation = useMutation({
    mutationFn: (newTask) => createTask(newTask, session.user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setToast('Tugas berhasil dibuat.')
      setSelectedTask(null)
      setShowCreateForm(false)
    },
    onError: () => {
      setToast('Buat tugas gagal.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, changes }) => updateTask(id, changes, session.user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setToast('Tugas berhasil diperbarui.')
      setSelectedTask(null)
      setShowCreateForm(false)
    },
    onError: () => {
      setToast('Perbarui tugas gagal.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (taskId) => deleteTask(taskId, session.user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setToast('Tugas berhasil dihapus.')
      setPendingDelete(null)
    },
    onError: () => {
      setToast('Hapus tugas gagal.')
    },
  })

  const handleSubmitTask = (payload) => {
    if (selectedTask) {
      updateMutation.mutate({ id: selectedTask.id, changes: payload })
      setSelectedTask(null)
      return
    }

    createMutation.mutate(payload)
    setShowCreateForm(false)
  }

  const handleStatusChange = (task, nextStatus) => {
    updateMutation.mutate({ id: task.id, changes: { status: nextStatus } })
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">TaskFlow</p>
          <h1>Dashboard</h1>
        </div>
        <div className="topbar-actions">
          <span>{session?.user?.email}</span>
          <button type="button" className="button secondary" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </header>

      <main className="dashboard-shell">
        <TaskSummary summary={summary} />

        <section className="panel">
          <div className="panel-header">
            <h2>Daftar tugas</h2>
            <button type="button" className="button primary" onClick={() => {
              setSelectedTask(null)
              setShowCreateForm(true)
            }}>
              Tambah tugas
            </button>
          </div>

          <TaskFilters value={filters} onChange={setFilters} />

            {showCreateForm && !selectedTask ? (
            <div className="task-form-shell">
              <TaskForm
                  key="new-task"
                initialValue={{
                  title: '',
                  description: '',
                  priority: 'medium',
                  due_date: '',
                  status: 'todo',
                }}
                onSubmit={handleSubmitTask}
                  onCancel={() => setShowCreateForm(false)}
                submitLabel="Tambah"
              />
            </div>
          ) : null}

          {selectedTask ? (
            <div className="task-form-shell">
              <TaskForm
                  key={selectedTask.id}
                initialValue={selectedTask}
                onSubmit={handleSubmitTask}
                  onCancel={() => {
                    setSelectedTask(null)
                    setShowCreateForm(false)
                  }}
                submitLabel="Simpan perubahan"
              />
            </div>
          ) : null}

          {isLoading ? <Spinner label="Memuat tugas..." /> : null}

          {isError ? (
            <div className="page-state">
              <p>{error?.message || 'Gagal memuat tugas.'}</p>
            </div>
          ) : null}

          {!isLoading && !isError && filteredTasks.length === 0 ? (
            <EmptyState
              title="Belum ada tugas"
              description="Coba tambah tugas baru atau ubah filter pencarian Anda."
              action={{ label: 'Tambah tugas', onClick: () => setSelectedTask(null) }}
            />
          ) : null}

          {!isLoading && !isError && filteredTasks.length > 0 ? (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(taskToEdit) => {
                    setSelectedTask(taskToEdit)
                    setShowCreateForm(false)
                  }}
                  onDelete={(taskToDelete) => setPendingDelete(taskToDelete)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : null}
        </section>
      </main>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus tugas?"
        message={`Apakah Anda yakin ingin menghapus "${pendingDelete?.title || ''}"?`}
        onConfirm={() => {
          if (pendingDelete) {
            deleteMutation.mutate(pendingDelete.id)
          }
        }}
        onCancel={() => setPendingDelete(null)}
      />
      <Toast message={toast} />
    </>
  )
}

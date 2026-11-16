const USERS_KEY = 'taskflow_users'
const SESSION_KEY = 'taskflow_session'

function readStorage(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getStoredUsers() {
  return readStorage(USERS_KEY, [])
}

export function saveStoredUsers(users) {
  writeStorage(USERS_KEY, users)
}

export function getSession() {
  return readStorage(SESSION_KEY, null)
}

export function saveSession(session) {
  writeStorage(SESSION_KEY, session)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export async function signUp({ email, password }) {
  const users = getStoredUsers()
  if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email sudah terdaftar.')
  }

  const user = {
    id: crypto.randomUUID(),
    email: email.trim(),
    password,
  }

  users.push(user)
  saveStoredUsers(users)

  const session = { user: { id: user.id, email: user.email } }
  saveSession(session)
  return session
}

export async function signIn({ email, password }) {
  const users = getStoredUsers()
  const user = users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
  )

  if (!user) {
    throw new Error('Email atau password salah.')
  }

  const session = { user: { id: user.id, email: user.email } }
  saveSession(session)
  return session
}

export async function signOut() {
  clearSession()
}

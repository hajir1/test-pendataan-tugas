import { useMemo, useState } from 'react'
import { getSession, signIn, signOut, signUp } from './authApi'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession())
  const [loading] = useState(false)

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      loading,
      async register(credentials) {
        const nextSession = await signUp(credentials)
        setSession(nextSession)
        return nextSession
      },
      async login(credentials) {
        const nextSession = await signIn(credentials)
        setSession(nextSession)
        return nextSession
      },
      async logout() {
        await signOut()
        setSession(null)
      },
    }),
    [loading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

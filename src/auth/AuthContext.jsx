import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginRequest, logout as logoutRequest, refreshSession } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    refreshSession()
      .then((session) => setUser(session))
      .finally(() => setReady(true))
  }, [])

  const value = useMemo(() => ({
    user,
    ready,
    async login(username, password) {
      const session = await loginRequest(username, password)
      setUser(session)
      return session
    },
    async logout() {
      await logoutRequest()
      setUser(null)
    }
  }), [user, ready])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

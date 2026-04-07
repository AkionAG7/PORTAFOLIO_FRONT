import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { getTokenCookie, setTokenCookie, removeTokenCookie } from '../lib/cookies'

interface JwtPayload {
  sub: string
  email: string
  rol: string
}

interface AuthUser {
  id: string
  email: string
  rol: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

function decodeJwt(token: string): JwtPayload {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(base64)) as JwtPayload
}

function tokenToUser(token: string): AuthUser {
  const payload = decodeJwt(token)
  return { id: payload.sub, email: payload.email, rol: payload.rol }
}

const AuthContext = createContext<AuthContextType | null>(null)

const storedToken = getTokenCookie()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(storedToken)
  const [user, setUser] = useState<AuthUser | null>(
    storedToken ? tokenToUser(storedToken) : null,
  )

  const login = useCallback((newToken: string) => {
    setTokenCookie(newToken)
    setToken(newToken)
    setUser(tokenToUser(newToken))
  }, [])

  const logout = useCallback(() => {
    removeTokenCookie()
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

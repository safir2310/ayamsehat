'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  userId: string
  username: string
  email: string
  phone: string
  address?: string
  avatar?: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string, role?: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

interface RegisterData {
  username: string
  password: string
  email: string
  phone: string
  role?: string
  birthDate?: string
  verificationCode?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    }
    return null
  })
  const [loading, setLoading] = useState(false)

  const login = async (username: string, password: string, role = 'user') => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login gagal')
    }

    const data = await response.json()
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const register = async (data: RegisterData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registrasi gagal')
    }

    return response.json()
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

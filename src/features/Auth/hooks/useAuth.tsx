"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { apiRequest } from "@/services/api"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  updateProfile: (profileData: { first_name: string; last_name: string }) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Cookie utility functions
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing token on mount
  useEffect(() => {
    const token = getCookie("auth_token")
    if (token) {
      // Verify token by calling the profile endpoint
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await apiRequest<{ user: User }>("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(response.user)
    } catch (error) {
      // Token is invalid, remove it
      deleteCookie("auth_token")
      console.log("Token verification failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      setCookie("auth_token", response.token, 7) // 7 days expiry
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiRequest<{ token: string; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      })

      setCookie("auth_token", response.token, 7) // 7 days expiry
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    deleteCookie("auth_token")
    setUser(null)
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      })
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (profileData: { first_name: string; last_name: string }) => {
    try {
      const response = await apiRequest<{ user: User }>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      })
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, changePassword, updateProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

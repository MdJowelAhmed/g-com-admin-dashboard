import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthStorage, logout as logoutAction } from '../redux/slice/authSlice'
import { useLogoutMutation } from '../redux/api/authApi'
import type { AppDispatch, RootState } from '../redux/store'

export type AuthUser = {
  name: string
  email: string
  location: string
  avatarUrl?: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const [logoutApi] = useLogoutMutation()
  const { token, email, role } = useSelector((state: RootState) => state.auth)

  const user = useMemo<AuthUser | null>(() => {
    if (!token || !email) return null

    return {
      name: role ? role.replace(/_/g, ' ') : 'Admin',
      email,
      location: 'Dhaka, Bangladesh',
    }
  }, [token, email, role])

  const logout = async () => {
    try {
      await logoutApi().unwrap()
    } catch {
      // clear local session even if API logout fails
    } finally {
      clearAuthStorage()
      dispatch(logoutAction())
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(token),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const TOKEN_KEY = 'token'
const ROLE_KEY = 'role'
const EMAIL_KEY = 'email'

export type AuthState = {
  token: string | null
  role: string | null
  email: string | null
}

function readStoredAuth(): AuthState {
  if (typeof localStorage === 'undefined') {
    return { token: null, role: null, email: null }
  }

  return {
    token: localStorage.getItem(TOKEN_KEY),
    role: localStorage.getItem(ROLE_KEY),
    email: localStorage.getItem(EMAIL_KEY),
  }
}

const initialState: AuthState = readStoredAuth()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; email: string; role?: string }>,
    ) => {
      state.token = action.payload.token
      state.email = action.payload.email
      state.role = action.payload.role ?? null
    },
    logout: (state) => {
      state.token = null
      state.email = null
      state.role = null
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer

export function clearAuthStorage() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem(EMAIL_KEY)
  localStorage.removeItem('refreshToken')
}

export function persistAuthStorage(payload: {
  token: string
  email: string
  role?: string
  refreshToken?: string
}) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(TOKEN_KEY, payload.token)
  localStorage.setItem(EMAIL_KEY, payload.email)
  if (payload.role) localStorage.setItem(ROLE_KEY, payload.role)
  if (payload.refreshToken) {
    localStorage.setItem('refreshToken', payload.refreshToken)
  }
}

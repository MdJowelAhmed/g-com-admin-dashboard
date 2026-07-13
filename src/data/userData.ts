export type UserStatus = 'Active' | 'Inactive'

export type User = {
  key: string
  sl: string
  name: string
  email: string
  phone: string
  address: string
  about: string
  role: string
  profileImage: string
  joiningDate: string
  status: UserStatus
  isVerified: boolean
  active: boolean
}

export const USER_STATUSES: UserStatus[] = ['Active', 'Inactive']

import type { User, UserStatus } from '../../data/userData'
import { baseApi, imageUrl } from './baseApi'

export type UserApiStatus = 'active' | 'inactive'

export interface UserApiDoc {
  _id: string
  name: string
  role: string
  email: string
  phone: string
  profileImage: string
  address: string
  about?: string
  business: unknown | null
  customer: string
  status: UserApiStatus
  isVerified: boolean
  isDeleted: boolean
  authProviders: string[]
  followersCount?: number
  followingCount?: number
  createdAt: string
  updatedAt: string
}

export interface UsersPagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

export interface UsersListResponse {
  success: boolean
  message: string
  pagination: UsersPagination
  data: UserApiDoc[]
}

export interface GetUsersParams {
  page?: number
  limit?: number
  searchTerm?: string
  status?: UserApiStatus
}

export interface UpdateUserStatusPayload {
  id: string
  status: UserApiStatus
}

export interface UpdateUserStatusResponse {
  success: boolean
  message: string
  data?: UserApiDoc
}

export const USER_STATUS_TO_API: Record<UserStatus, UserApiStatus> = {
  Active: 'active',
  Inactive: 'inactive',
}

function formatJoiningDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function resolveUserMediaUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${imageUrl}${path}`
}

export function mapUserFromApi(doc: UserApiDoc, index: number): User {
  const status: UserStatus = doc.status === 'inactive' ? 'Inactive' : 'Active'

  return {
    key: doc._id,
    sl: String(index + 1).padStart(2, '0'),
    name: doc.name,
    email: doc.email,
    phone: doc.phone || '—',
    address: doc.address || '—',
    about: doc.about?.trim() || '—',
    role: doc.role,
    profileImage: doc.profileImage ?? '',
    joiningDate: formatJoiningDate(doc.createdAt),
    status,
    isVerified: doc.isVerified,
    active: doc.status === 'active',
  }
}

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersListResponse, GetUsersParams | undefined>({
      query: (params = {}) => ({
        url: '/admin-dashboard/customers',
        method: 'GET',
        params,
      }),
      providesTags: ['Users'],
    }),
    updateUserStatus: builder.mutation<
      UpdateUserStatusResponse,
      UpdateUserStatusPayload
    >({
      query: ({ id, status }) => ({
        url: `/admin-dashboard/customers/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const { useGetUsersQuery, useUpdateUserStatusMutation } = userApi

import type { User, UserStatus } from '../../data/userData'
import { baseApi } from './baseApi'

export type UserApiStatus = 'active' | 'inactive'

export interface UserApiDoc {
  _id: string
  name: string
  role: string
  email: string
  phone: string
  profileImage: string
  address: string
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

function formatJoiningDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function mapAccountStatus(doc: UserApiDoc): UserStatus {
  if (doc.status === 'inactive') return 'Suspended'
  if (doc.isVerified) return 'Verified'
  return 'Pending'
}

export function mapUserFromApi(doc: UserApiDoc, index: number): User {
  return {
    key: doc._id,
    sl: String(index + 1).padStart(2, '0'),
    name: doc.name,
    email: doc.email,
    phone: doc.phone || '—',
    address: doc.address || '—',
    totalOrders: 0,
    joiningDate: formatJoiningDate(doc.createdAt),
    status: mapAccountStatus(doc),
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

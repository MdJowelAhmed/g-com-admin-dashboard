import type {
  Controller,
  PagePermission,
} from '../../components/dashboard/controllerData'
import { PAGE_PERMISSIONS } from '../../components/dashboard/controllerData'
import { baseApi } from './baseApi'

export type ControllerApiStatus = 'active' | 'inactive'

export interface ControllerUserRef {
  _id: string
  name: string
  email: string
  profileImage: string
  status: ControllerApiStatus
}

export interface ControllerApiDoc {
  _id: string
  user: ControllerUserRef
  permissions: string[]
  status: ControllerApiStatus
  createdAt: string
  updatedAt: string
}

export interface ControllersPagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

export interface ControllersListResponse {
  success: boolean
  message: string
  pagination: ControllersPagination
  data: ControllerApiDoc[]
}

export interface GetControllersParams {
  page?: number
  limit?: number
}

export interface ControllerPayload {
  name: string
  email: string
  permissions: ControllerPermissionKey[]
}

export interface ControllerMutationResponse {
  success: boolean
  message: string
  data?: ControllerApiDoc
}

export interface UpdateControllerArgs {
  id: string
  body: ControllerPayload
}

export interface DeleteControllerResponse {
  success: boolean
  message: string
}

export type ControllerPermissionKey =
  | 'dashboard'
  | 'user_management'
  | 'business_management'
  | 'categories'
  | 'payments'
  | 'settings'
  | 'support'
  | 'promotions'

export const PERMISSION_TO_API: Record<PagePermission, ControllerPermissionKey> =
  {
    Dashboard: 'dashboard',
    'User Management': 'user_management',
    'Business Management': 'business_management',
    Categories: 'categories',
    Payments: 'payments',
    Settings: 'settings',
    Support: 'support',
    Promotions: 'promotions',
  }

export const API_TO_PERMISSION = Object.fromEntries(
  Object.entries(PERMISSION_TO_API).map(([label, key]) => [key, label]),
) as Record<string, PagePermission>

export function permissionsToApi(
  permissions: PagePermission[],
): ControllerPermissionKey[] {
  return permissions.map((permission) => PERMISSION_TO_API[permission])
}

export function permissionsFromApi(permissions: string[]): PagePermission[] {
  return permissions
    .map((permission) => API_TO_PERMISSION[permission])
    .filter((permission): permission is PagePermission =>
      PAGE_PERMISSIONS.includes(permission),
    )
}

export function mapControllerFromApi(
  doc: ControllerApiDoc,
  index: number,
): Controller {
  return {
    key: doc._id,
    sl: String(index + 1).padStart(2, '0'),
    name: doc.user.name,
    email: doc.user.email,
    pageAccess: permissionsFromApi(doc.permissions),
    suspended: doc.status === 'inactive' || doc.user.status === 'inactive',
  }
}

const controllerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createController: builder.mutation<
      ControllerMutationResponse,
      ControllerPayload
    >({
      query: (body) => ({
        url: '/admin',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Controllers'],
    }),
    getControllers: builder.query<
      ControllersListResponse,
      GetControllersParams | undefined
    >({
      query: (params = {}) => ({
        url: '/admin',
        method: 'GET',
        params,
      }),
      providesTags: ['Controllers'],
    }),
    updateController: builder.mutation<
      ControllerMutationResponse,
      UpdateControllerArgs
    >({
      query: ({ id, body }) => ({
        url: `/admin/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Controllers'],
    }),
    deleteController: builder.mutation<DeleteControllerResponse, string>({
      query: (id) => ({
        url: `/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Controllers'],
    }),
  }),
})

export const {
  useCreateControllerMutation,
  useGetControllersQuery,
  useUpdateControllerMutation,
  useDeleteControllerMutation,
} = controllerApi

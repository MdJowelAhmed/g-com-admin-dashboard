import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

/** Encode query params with `%20` for spaces (not `+`) so backends receive real spaces. */
function paramsSerializer(params: Record<string, unknown>) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&')
}

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL + '/api/v1',
        paramsSerializer,
        prepareHeaders: (headers, { getState, endpoint }) => {
            if (endpoint === 'resetPassword') {
                return headers
            }

            const stateToken = (getState() as RootState).auth.token
            const token =
                stateToken ??
                (typeof localStorage !== 'undefined'
                    ? localStorage.getItem('token')
                    : null)
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
 tagTypes: [
  'Auth',
  'Category',
  'Chats',

  'DailySafetyReports',
  'Customers',
  'Payment',
  'Notification',
  'Promotions',
  'Users',
  'Controllers',
  'Events',
  'Shops',
  'Orders',
  'Overview',
  'PayoutHistory',
  'SubCategory',
  'Setting',
],
  
   
    endpoints: () => ({}),
})

export const imageUrl = import.meta.env.VITE_API_BASE_URL
export const socketUrl = import.meta.env.VITE_API_BASE_URL 

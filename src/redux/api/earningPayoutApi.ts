import { baseApi } from './baseApi'

export interface PayoutBusinessRef {
  _id: string
  businessName: string
}

export interface PayoutDoc {
  _id: string
  business: PayoutBusinessRef
  wallet: string
  amount: number
  method: string
  status: string
  clientReference: string
  createdAt: string
  updatedAt: string
}

export interface PayoutsPagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

export interface PayoutHistoryResponse {
  success: boolean
  message: string
  pagination: PayoutsPagination
  data: PayoutDoc[]
}

export interface GetPayoutsParams {
  page?: number
  limit?: number
  status?: string
  method?: string
}

export interface PayoutListItem {
  key: string
  sl: string
  clientReference: string
  businessName: string
  method: string
  amount: number
  status: string
  createdAt: string
}

export const API_PAYOUT_STATUSES = [
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
] as const

export const PAYOUT_METHODS = ['Vodafone', 'MTN', 'AirtelTigo'] as const

export function formatPayoutStatus(status: string) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatPayoutDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function mapPayoutFromApi(doc: PayoutDoc, index: number): PayoutListItem {
  return {
    key: doc._id,
    sl: String(index + 1).padStart(2, '0'),
    clientReference: doc.clientReference,
    businessName: doc.business.businessName,
    method: doc.method,
    amount: doc.amount,
    status: doc.status,
    createdAt: formatPayoutDate(doc.createdAt),
  }
}

const earningPayoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayoutHistory: builder.query<PayoutHistoryResponse, GetPayoutsParams | undefined>({
      query: (params = {}) => ({
        url: '/admin-dashboard/payouts',
        method: 'GET',
        params,
      }),
      providesTags: ['PayoutHistory'],
    }),
  }),
})

export const { useGetPayoutHistoryQuery } = earningPayoutApi

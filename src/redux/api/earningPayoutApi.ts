import { baseApi } from './baseApi'

export interface PayoutBusinessRef {
  _id: string
  businessName: string
}

export interface PayoutTransactionExtractedFields {
  clientReference?: string
  transactionId?: string | null
  externalTransactionId?: string | null
  amount?: number
  charges?: number
  description?: string
  failureReason?: string
}

export interface PayoutTransactionData {
  AmountDebited?: number
  TransactionId?: string
  ClientReference?: string
  Description?: string
  ExternalTransactionId?: string | null
  Amount?: number
  Charges?: number
  Meta?: unknown
  RecipientName?: string
}

export interface PayoutTransactionDetails {
  ResponseCode?: string
  Data?: PayoutTransactionData
  processedAt?: string
  extractedFields?: PayoutTransactionExtractedFields
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
  transactionDetails?: PayoutTransactionDetails
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
  searchTerm?: string
  status?: string
}

export interface PayoutListItem {
  key: string
  sl: string
  clientReference: string
  businessId: string
  businessName: string
  wallet: string
  method: string
  amount: number
  status: string
  createdAt: string
  updatedAt: string
  recipientName: string | null
  transactionId: string | null
  charges: number | null
  failureReason: string | null
  description: string | null
  responseCode: string | null
  processedAt: string | null
}

export const API_PAYOUT_STATUSES = [
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
] as const

export type ApiPayoutStatus = (typeof API_PAYOUT_STATUSES)[number]

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
  const details = doc.transactionDetails
  const extracted = details?.extractedFields
  const data = details?.Data

  return {
    key: doc._id,
    sl: String(index + 1).padStart(2, '0'),
    clientReference: doc.clientReference,
    businessId: doc.business._id,
    businessName: doc.business.businessName,
    wallet: doc.wallet,
    method: doc.method,
    amount: doc.amount,
    status: doc.status,
    createdAt: formatPayoutDate(doc.createdAt),
    updatedAt: formatPayoutDate(doc.updatedAt),
    recipientName: data?.RecipientName ?? null,
    transactionId:
      extracted?.transactionId ?? data?.TransactionId ?? null,
    charges: extracted?.charges ?? data?.Charges ?? null,
    failureReason: extracted?.failureReason ?? null,
    description:
      extracted?.description ?? data?.Description ?? null,
    responseCode: details?.ResponseCode ?? null,
    processedAt: details?.processedAt
      ? formatPayoutDate(details.processedAt)
      : null,
  }
}

const earningPayoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayoutHistory: builder.query<
      PayoutHistoryResponse,
      GetPayoutsParams | undefined
    >({
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

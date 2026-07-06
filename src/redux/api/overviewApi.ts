import {
  type OrderBranchRef,
  type OrderBusinessRef,
  type OrderCustomerRef,
} from './orderManageApi'
import { baseApi } from './baseApi'

export interface OverviewStats {
  totalOrders: number
  totalBusinesses: number
  totalUsers: number
  totalRevenue: number
}

export interface OverviewResponse {
  success: boolean
  message: string
  data: OverviewStats
}

export interface MonthlyRevenue {
  month: number
  revenue: number
  orderCount: number
}

export interface OverviewChartsData {
  year: number
  monthlyRevenue: MonthlyRevenue[]
}

export interface OverviewChartsResponse {
  success: boolean
  message: string
  data: OverviewChartsData
}

export interface RecentOrderDoc {
  _id: string
  orderId: string
  status: string
  paymentStatus: string
  totalAmount: number
  customerFee: number
  providerFee: number
  totalRevenue: number
  customer: OrderCustomerRef
  business: OrderBusinessRef
  branch: OrderBranchRef | null
}

export interface RecentOrdersResponse {
  success: boolean
  message: string
  data: RecentOrderDoc[]
}

export interface RecentOrderRow {
  key: string
  sl: string
  orderId: string
  customerName: string
  businessName: string
  totalAmount: number
  status: string
  paymentStatus: string
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]

export function mapMonthlyRevenueToChart(monthlyRevenue: MonthlyRevenue[]) {
  return monthlyRevenue.map((entry) => ({
    month: MONTH_LABELS[entry.month - 1] ?? String(entry.month),
    value: entry.revenue,
    orderCount: entry.orderCount,
  }))
}

export function mapRecentOrderFromApi(
  doc: RecentOrderDoc,
  index: number,
): RecentOrderRow {
  return {
    key: doc._id,
    sl: String(index + 1).padStart(2, '0'),
    orderId: doc.orderId,
    customerName: doc.customer.name,
    businessName: doc.business.businessName,
    totalAmount: doc.totalAmount,
    status: doc.status,
    paymentStatus: doc.paymentStatus,
  }
}

export function formatOverviewStatus(status: string) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewStats: builder.query<OverviewResponse, void>({
      query: () => ({
        url: '/admin-dashboard/overview',
        method: 'GET',
      }),
      providesTags: ['Overview'],
    }),
    getOverviewYearlyRevenue: builder.query<OverviewChartsResponse, number>({
      query: (year) => ({
        url: '/admin-dashboard/revenue-by-month',
        method: 'GET',
        params: { year },
      }),
      providesTags: ['Overview'],
    }),
    recentOrders: builder.query<RecentOrdersResponse, void>({
      query: () => ({
        url: '/admin-dashboard/recent-orders',
        method: 'GET',
      }),
      providesTags: ['Overview'],
    }),
  }),
})

export const {
  useGetOverviewStatsQuery,
  useGetOverviewYearlyRevenueQuery,
  useRecentOrdersQuery,
} = overviewApi

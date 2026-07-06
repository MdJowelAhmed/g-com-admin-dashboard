import { baseApi } from './baseApi'

export type ApiOrderStatus =
  | 'pending'
  | 'delivered'
  | 'cancelled'
  | 'disputed'
  | 'processing'
  | 'confirmed'
  | 'completed'

export type ApiOrderType = 'product' | 'service' | 'stay' | 'custom'

export type DisputeResolution = 'refund' | 'release'

export interface OrderCustomerRef {
  _id: string
  name: string
  email?: string
  phone?: string
  profileImage?: string
}

export interface OrderBusinessRef {
  _id: string
  businessName: string
  businessLogo?: string
}

export interface OrderBranchRef {
  _id: string
  branchName: string
}

export interface OrderListDoc {
  _id: string
  orderId: string
  customer: OrderCustomerRef
  business: OrderBusinessRef
  branch: OrderBranchRef | null
  orderType: ApiOrderType
  status: ApiOrderStatus
  paymentStatus: string
  totalAmount: number
}

export interface OrdersPagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

export interface OrdersListResponse {
  success: boolean
  message: string
  pagination: OrdersPagination
  data: OrderListDoc[]
}

export interface GetOrdersParams {
  page?: number
  limit?: number
  status?: string
  orderType?: string
}

export interface ProductLineItem {
  _id: string
  product?: {
    _id: string
    name: string
    image: string
    price: number
  }
  quantity: number
  totalAmount: number
  items?: Array<{
    name: string
    price: number
    quantity: number
  }>
}

export interface ServiceLineItem {
  _id: string
  service?: {
    _id: string
    name: string
    image: string
    price: number
  }
  duration?: string
  startTime?: string
  location?: string
  price?: number
  totalAmount: number
  status?: string
}

export interface StayLineItem {
  _id: string
  room?: {
    _id: string
    name: string
    basePrice: number
    image: string
  }
  roomNumber?: string
  checkIn?: string
  checkOut?: string
  adult?: number
  children?: number
  night?: number
  pricePerNight?: number
  totalAmount: number
  status?: string
}

export interface CustomLineItem {
  _id: string
  quantity: number
  totalAmount: number
  items?: Array<{
    itemId: string
    itemType: string
    price: number
    quantity: number
  }>
}

export interface OrderFulfillment {
  method?: string
  pickupLocation?: {
    name: string
    latitude: number
    longitude: number
  }
}

export interface OrderDetailDoc {
  _id: string
  orderId: string
  customer: OrderCustomerRef
  business: OrderBusinessRef
  branch: OrderBranchRef | null
  orderType: ApiOrderType
  status: ApiOrderStatus
  paymentStatus: string
  totalAmount: number
  paymentType?: string
  paymentMethod?: string
  clientReference?: string
  subTotal?: number
  customerFee?: number
  providerFee?: number
  deliveryFee?: number
  providerAmount?: number
  fulfillment?: OrderFulfillment
  createdAt: string
  updatedAt: string
  lineItems:
    | ProductLineItem[]
    | ServiceLineItem
    | StayLineItem
    | CustomLineItem[]
  review?: unknown
  hasReview?: boolean
  canReview?: boolean
}

export interface OrderResponse {
  success: boolean
  message: string
  data: OrderDetailDoc
}

export interface ResolveDisputePayload {
  id: string
  resolution: DisputeResolution
}

export interface OrderListItem {
  key: string
  sl: string
  orderId: string
  customerName: string
  businessName: string
  branchName: string | null
  orderType: ApiOrderType
  status: ApiOrderStatus
  paymentStatus: string
  totalAmount: number
}

export const API_ORDER_STATUSES: ApiOrderStatus[] = [
  'pending',
  'processing',
  'confirmed',
  'delivered',
  'completed',
  'cancelled',
  'disputed',
]

function formatStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function mapOrderFromApi(doc: OrderListDoc, index: number): OrderListItem {
  return {
    key: doc._id,
    sl: String(index + 1).padStart(2, '0'),
    orderId: doc.orderId,
    customerName: doc.customer.name,
    businessName: doc.business.businessName,
    branchName: doc.branch?.branchName ?? null,
    orderType: doc.orderType,
    status: doc.status,
    paymentStatus: doc.paymentStatus,
    totalAmount: doc.totalAmount,
  }
}

export function formatOrderType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export { formatStatusLabel }

const orderManageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersListResponse, GetOrdersParams | undefined>({
      query: (params = {}) => ({
        url: '/admin-dashboard/orders',
        method: 'GET',
        params,
      }),
      providesTags: ['Orders'],
    }),
    getSingleOrder: builder.query<OrderResponse, string>({
      query: (id) => ({
        url: `/admin-dashboard/orders/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
    }),
    resolveDispute: builder.mutation<OrderResponse, ResolveDisputePayload>({
      query: ({ id, resolution }) => ({
        url: `/orders/${id}/resolve-dispute`,
        method: 'PATCH',
        body: { resolution },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetSingleOrderQuery,
  useLazyGetSingleOrderQuery,
  useResolveDisputeMutation,
} = orderManageApi

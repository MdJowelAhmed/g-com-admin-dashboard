import { baseApi } from './baseApi'

export type PromotionApiType =
  | 'bilboard_courosel'
  | 'latest_promotions'
  | 'sponsored_deals'

export interface CreatePromotionPayload {
  title: string
  description: string
  type: PromotionApiType
  startDate: string
  endDate: string
  promotionPrice: number
  attachment: string
  websiteUrl?: string
  linkedBusiness?: string
  linkedProduct?: string
}

export interface PromotionApiDoc {
  _id: string
  title: string
  description: string
  type: PromotionApiType
  startDate: string
  endDate: string
  promotionPrice: number
  attachment: string
  websiteUrl?: string
  isPublished: boolean
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface PromotionsPagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

export interface PromotionsListResponse {
  success: boolean
  message: string
  pagination: PromotionsPagination
  data: PromotionApiDoc[]
}

export interface CreatePromotionResponse {
  success: boolean
  message: string
  data?: PromotionApiDoc
}

export interface PromotionMutationResponse {
  success: boolean
  message: string
  data?: PromotionApiDoc
}

export type UpdatePromotionBody = Partial<CreatePromotionPayload> & {
  isPublished?: boolean
}

export interface UpdatePromotionPayload {
  id: string
  body: UpdatePromotionBody
}

export interface GetPromotionsParams {
  page?: number
  limit?: number
}

export type PromotionBusinessCategory =
  | 'shop'
  | 'dine'
  | 'services'
  | 'stay'
  | 'event'

export interface PromotionProductDoc {
  _id: string
  name: string
  category?: string
  price: number
  business?: string
}

export interface PromotionProductsResponse {
  success: boolean
  message: string
  pagination?: PromotionsPagination
  data: Array<Record<string, unknown>>
}

export interface GetPromotionProductsParams {
  businessId: string
  category: PromotionBusinessCategory
}

const homeControllerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPromotion: builder.mutation<
      CreatePromotionResponse,
      CreatePromotionPayload
    >({
      query: (body) => ({
        url: '/promotions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Promotions'],
    }),
    getPromotions: builder.query<
      PromotionsListResponse,
      GetPromotionsParams | undefined
    >({
      query: (params = {}) => ({
        url: '/promotions/admin',
        method: 'GET',
        params,
      }),
      providesTags: ['Promotions'],
    }),
    getPromotionProducts: builder.query<PromotionProductsResponse, GetPromotionProductsParams>({
      query: ({ businessId, category }) => {
        const endpointByCategory: Record<PromotionBusinessCategory, string> = {
          shop: `/products/business/${businessId}`,
          dine: `/products/business/${businessId}`,
          services: `/services/business/${businessId}`,
          stay: `/rooms/business/${businessId}`,
          event: `/events/business/${businessId}`,
        }

        return {
          url: endpointByCategory[category],
          method: 'GET',
        }
      },
    }),
    updatePromotion: builder.mutation<PromotionMutationResponse, UpdatePromotionPayload>({
      query: ({ id, body }) => ({
        url: `/promotions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Promotions'],
    }),
    deletePromotion: builder.mutation<PromotionMutationResponse, string>({
      query: (id) => ({
        url: `/promotions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Promotions'],
    }),
  }),
})

export const {
  useCreatePromotionMutation,
  useGetPromotionsQuery,
  useGetPromotionProductsQuery,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = homeControllerApi

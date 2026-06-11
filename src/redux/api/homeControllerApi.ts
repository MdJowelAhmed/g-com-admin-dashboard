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

export interface GetPromotionsParams {
  page?: number
  limit?: number
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
  }),
})

export const {
  useCreatePromotionMutation,
  useGetPromotionsQuery,
} = homeControllerApi

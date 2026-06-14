import { baseApi } from './baseApi'

export type DisclaimerType =
  | 'customer-terms-and-conditions'
  | 'provider-terms-and-conditions'
  | 'customer-privacy-policy'
  | 'provider-privacy-policy'

export interface DisclaimerDoc {
  _id: string
  type: DisclaimerType
  content: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface DisclaimerResponse {
  success: boolean
  message: string
  data: DisclaimerDoc
}

export interface UpdateDisclaimerPayload {
  type: DisclaimerType
  content: string
}

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisclaimer: builder.query<DisclaimerResponse, DisclaimerType>({
      query: (type) => ({
        url: `/disclaimers/${type}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, type) => [{ type: 'Setting', id: type }],
    }),
    updateDisclaimer: builder.mutation<
      DisclaimerResponse,
      UpdateDisclaimerPayload
    >({
      query: (payload) => ({
        url: '/disclaimers',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { type }) => [
        { type: 'Setting', id: type },
      ],
    }),
  }),
})

export const { useGetDisclaimerQuery, useUpdateDisclaimerMutation } = settingApi

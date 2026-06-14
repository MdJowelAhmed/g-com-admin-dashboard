import type { SubCategory } from '../../components/dashboard/categoryData'
import { baseApi } from './baseApi'

export type SubCategoryApiStatus = 'active' | 'archive'

export interface SubCategoryApiDoc {
  _id: string
  name: string
  category: string
  parent: string | null
  status: SubCategoryApiStatus
  createdAt: string
  updatedAt: string
}

export interface SubCategoriesPagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

export interface SubCategoriesListResponse {
  success: boolean
  message: string
  pagination: SubCategoriesPagination
  data: SubCategoryApiDoc[]
}

export interface GetSubCategoriesParams {
  category: string
  page?: number
  limit?: number
}

export interface SubCategoryPayload {
  name: string
  category: string
}

export interface SubCategoryMutationResponse {
  success: boolean
  message: string
  data?: SubCategoryApiDoc
}

export interface UpdateSubCategoryArgs {
  id: string
  body: SubCategoryPayload
}

export function mapSubCategoryFromApi(doc: SubCategoryApiDoc): SubCategory {
  return {
    id: doc._id,
    name: doc.name,
    status: doc.status,
  }
}

const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategories: builder.query<
      SubCategoriesListResponse,
      GetSubCategoriesParams
    >({
      query: ({ category, ...params }) => ({
        url: '/sub-categories',
        method: 'GET',
        params: { category, ...params },
      }),
      providesTags: (_result, _error, { category }) => [
        { type: 'SubCategory', id: category },
      ],
    }),
    createSubCategory: builder.mutation<
      SubCategoryMutationResponse,
      SubCategoryPayload
    >({
      query: (body) => ({
        url: '/sub-categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { category }) => [
        { type: 'SubCategory', id: category },
      ],
    }),
    updateSubCategory: builder.mutation<
      SubCategoryMutationResponse,
      UpdateSubCategoryArgs
    >({
      query: ({ id, body }) => ({
        url: `/sub-categories/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { body }) => [
        { type: 'SubCategory', id: body.category },
      ],
    }),
    deleteSubCategory: builder.mutation<SubCategoryMutationResponse, string>({
      query: (id) => ({
        url: `/sub-categories/${id}/soft-delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubCategory'],
    }),
  }),
})

export const {
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi

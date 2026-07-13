import type { Shop, ShopStatus } from '../../data/shopData'
import { baseApi, imageUrl } from './baseApi'

export type VerificationApiStatus = 'pending' | 'approved' | 'rejected'

export interface BusinessUserRef {
  _id: string
  name: string
  role: string
  email: string
  phone: string
  profileImage: string
  address: string
  status: string
  isVerified: boolean
}

export interface BusinessLocation {
  type: 'Point'
  coordinates: [number, number]
}

export interface BusinessVerificationDoc {
  _id: string
  user: string
  businessProof: string
  verificationDocumentType: string
  verificationDocument: string
  status: VerificationApiStatus
  createdAt: string
  updatedAt: string
}

export interface BusinessApiDoc {
  _id: string
  user: BusinessUserRef
  businessPhone?: string
  businessAddress?: string
  businessLocation?: string
  isBusinessVerified: boolean
  followersCount?: number
  totalPosts?: number
  averageRating?: number
  totalReviews?: number
  socialLinks?: Record<string, string>
  paymentsActive?: boolean
  createdAt: string
  updatedAt: string
  businessName?: string
  category?: string
  businessLogo?: string
  coverImage?: string
  description?: string
  location?: BusinessLocation
  verification?: BusinessVerificationDoc[]
}

export interface ShopsPagination {
  total: number
  limit: number
  page: number
  totalPage: number
}

export interface ShopsListResponse {
  success: boolean
  message: string
  pagination: ShopsPagination
  data: BusinessApiDoc[]
}

export interface GetShopsParams {
  page?: number
  limit?: number
  searchTerm?: string
  status?: string
}

/** Map UI shop status labels to API `status` query values */
export const SHOP_STATUS_TO_API: Record<ShopStatus, string> = {
  Pending: 'pending',
  'In Review': 'pending',
  Verified: 'approved',
  Suspended: 'rejected',
}

export type ShopApprovalStatus = 'approved' | 'rejected'

export interface UpdateShopStatusPayload {
  id: string
  status: ShopApprovalStatus
}

export interface ShopMutationResponse {
  success: boolean
  message: string
  data?: BusinessApiDoc
}

const CATEGORY_LABELS: Record<string, string> = {
  shop: 'Shop',
  dine: 'Dine',
  services: 'Services',
  stay: 'Stay',
  event: 'Event',
}

function formatJoiningDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getLatestVerification(doc: BusinessApiDoc) {
  if (!doc.verification?.length) return undefined
  return doc.verification[doc.verification.length - 1]
}

function getShopStatus(doc: BusinessApiDoc): ShopStatus {
  if (doc.isBusinessVerified) return 'Verified'

  const latest = getLatestVerification(doc)
  if (!latest) return 'Pending'
  if (latest.status === 'pending') return 'In Review'
  if (latest.status === 'rejected') return 'Suspended'
  if (latest.status === 'approved') return 'Verified'

  return 'Pending'
}

export function hasVerificationDocuments(
  shop: Pick<Shop, 'verification'>,
): boolean {
  return (shop.verification ?? []).length > 0
}

export function canReviewShop(
  shop: Pick<Shop, 'isBusinessVerified' | 'verification'>,
): boolean {
  if (shop.isBusinessVerified) return false

  const verifications = shop.verification ?? []
  // Approve/Reject only when verification documents exist
  if (verifications.length === 0) return false

  const latest = verifications[verifications.length - 1]
  if (latest.status === 'rejected' || latest.status === 'approved') {
    return false
  }

  return latest.status === 'pending'
}

export function resolveMediaUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${imageUrl}${path}`
}

export function mapShopFromApi(doc: BusinessApiDoc, index: number): Shop {
  const categoryKey = doc.category ?? ''
  const categoryLabel = CATEGORY_LABELS[categoryKey] ?? (categoryKey || '—')

  return {
    key: doc._id,
    sl: String(index + 1).padStart(2, '0'),
    shopId: doc._id.slice(-8).toUpperCase(),
    name: doc.businessName ?? doc.user.name,
    type: categoryLabel,
    category: categoryLabel,
    joiningDate: formatJoiningDate(doc.createdAt),
    status: getShopStatus(doc),
    owner: doc.user.name,
    email: doc.user.email,
    phone: doc.businessPhone ?? doc.user.phone ?? '—',
    address: doc.businessAddress ?? doc.businessLocation ?? doc.user.address ?? '—',
    description: doc.description ?? '—',
    businessLogo: doc.businessLogo,
    coverImage: doc.coverImage,
    isBusinessVerified: doc.isBusinessVerified,
    verification: (doc.verification ?? []).map((item) => ({
      id: item._id,
      user: item.user,
      businessProof: item.businessProof,
      verificationDocumentType: item.verificationDocumentType,
      verificationDocument: item.verificationDocument,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
  }
}

const shopManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query<ShopsListResponse, GetShopsParams | undefined>({
      query: (params = {}) => ({
        url: '/admin-dashboard/businesses',
        method: 'GET',
        params,
      }),
      providesTags: ['Shops'],
    }),
    updateShopStatus: builder.mutation<
      ShopMutationResponse,
      UpdateShopStatusPayload
    >({
      query: ({ id, status }) => ({
        url: `/admin-dashboard/businesses/${id}/approval-status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Shops'],
    }),
  }),
})

export const { useGetShopsQuery, useUpdateShopStatusMutation } =
  shopManagementApi

import { useMemo, useState } from 'react'
import { message, Spin } from 'antd'
import { Plus } from 'lucide-react'
import PromotionsTable, {
  type Promotion,
  type PromotionStatus,
} from '../../components/dashboard/PromotionsTable'
import AddPromotionModal from '../../components/dashboard/AddPromotionModal'
import {
  type CreatePromotionPayload,
  type PromotionApiDoc,
  type PromotionApiType,
  useCreatePromotionMutation,
  useDeletePromotionMutation,
  useGetPromotionsQuery,
  useUpdatePromotionMutation,
} from '../../redux/api/homeControllerApi'

const promotionTypeLabels: Record<PromotionApiType, string> = {
  bilboard_courosel: 'Billboard Carousel',
  latest_promotions: 'Latest Promotions',
  sponsored_deals: 'Sponsored Deals',
}

function formatPromotionDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatPromotionTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getPromotionStatus(startDate: string, endDate: string): PromotionStatus {
  const now = Date.now()
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()

  if (now > end) return 'Completed'
  if (now >= start) return 'In Progress'
  return 'Pending'
}

function mapPromotionToTableRow(
  doc: PromotionApiDoc,
  index: number,
): Promotion {
  return {
    key: doc._id,
    sl: String(index + 1).padStart(2, '0'),
    image: doc.attachment,
    title: doc.title,
    startDate: formatPromotionDate(doc.startDate),
    startTime: formatPromotionTime(doc.startDate),
    endDate: formatPromotionDate(doc.endDate),
    endTime: formatPromotionTime(doc.endDate),
    type: promotionTypeLabels[doc.type] ?? doc.type,
    amount: doc.promotionPrice,
    status: getPromotionStatus(doc.startDate, doc.endDate),
    published: doc.isPublished,
  }
}

export default function HomeControl() {
  const [formMode, setFormMode] = useState<{
    open: boolean
    promotion: PromotionApiDoc | null
  }>({ open: false, promotion: null })

  const { data, isLoading, isError } = useGetPromotionsQuery(undefined)
  const [createPromotion, { isLoading: isCreating }] =
    useCreatePromotionMutation()
  const [updatePromotion, { isLoading: isUpdating }] =
    useUpdatePromotionMutation()
  const [deletePromotion] = useDeletePromotionMutation()

  const isSubmitting = isCreating || isUpdating

  const promotions = useMemo(
    () => (data?.data ?? []).map(mapPromotionToTableRow),
    [data],
  )

  const openCreate = () => setFormMode({ open: true, promotion: null })

  const openEdit = (key: string) => {
    const promotion = (data?.data ?? []).find((doc) => doc._id === key)
    if (!promotion) {
      message.error('Promotion not found.')
      return
    }
    setFormMode({ open: true, promotion })
  }

  const closeForm = () => {
    if (isSubmitting) return
    setFormMode({ open: false, promotion: null })
  }

  const handleSubmit = async (payload: CreatePromotionPayload) => {
    try {
      if (formMode.promotion) {
        const result = await updatePromotion({
          id: formMode.promotion._id,
          body: payload,
        }).unwrap()
        message.success(result.message || 'Promotion updated successfully.')
      } else {
        const result = await createPromotion(payload).unwrap()
        message.success(result.message || 'Promotion created successfully.')
      }
      setFormMode({ open: false, promotion: null })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : formMode.promotion
            ? 'Failed to update promotion.'
            : 'Failed to create promotion.'
      message.error(errorMessage)
    }
  }

  const handleDelete = async (key: string) => {
    try {
      const result = await deletePromotion(key).unwrap()
      message.success(result.message || 'Promotion deleted successfully.')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete promotion.'
      message.error(errorMessage)
    }
  }

  const handleTogglePublish = async (key: string, next: boolean) => {
    try {
      const result = await updatePromotion({
        id: key,
        body: { isPublished: next },
      }).unwrap()
      message.success(
        result.message ||
          (next ? 'Promotion published.' : 'Promotion hidden.'),
      )
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update publish status.'
      message.error(errorMessage)
    }
  }

  return (
    <div className="py-6">
      <section className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-white">Promotion</h1>

          <button
            type="button"
            onClick={openCreate}
            className="flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            <Plus size={16} />
            Add New Promotion
          </button>
        </header>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spin size="large" />
            </div>
          ) : isError ? (
            <p className="py-10 text-center text-sm text-red-400">
              Failed to load promotions. Please try again.
            </p>
          ) : (
            <PromotionsTable
              data={promotions}
              onEdit={openEdit}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />
          )}
        </div>
      </section>

      <AddPromotionModal
        open={formMode.open}
        promotion={formMode.promotion}
        onClose={closeForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

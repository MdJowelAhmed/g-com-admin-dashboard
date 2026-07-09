import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Modal, Select, message } from 'antd'
import { ChevronDown, Sparkles } from 'lucide-react'
import FormControl, { controlClass, textareaClass } from './FormControl'
import ImageUploader from '../common/ImageUploader'
import {
  uploadImageFile,
  useGetPresignedUploadUrlMutation,
} from '../../redux/api/imageUploadApi'
import { useGetShopsQuery } from '../../redux/api/shopManagementApi'
import {
  useGetPromotionProductsQuery,
  type PromotionBusinessCategory,
} from '../../redux/api/homeControllerApi'
import type {
  CreatePromotionPayload,
  PromotionApiDoc,
  PromotionApiType,
} from '../../redux/api/homeControllerApi'

type PromotionTypeLabel =
  | 'Billboard Carousel'
  | 'Latest Promotions'
  | 'Sponsored Deals'

type PromotionSourceLabel = 'External' | 'Internal'
type PromotionCategory = PromotionBusinessCategory

type FormState = {
  title: string
  description: string
  type: PromotionTypeLabel
  sourceType: PromotionSourceLabel
  category: PromotionCategory
  linkedBusiness: string
  linkedProduct: string
  startDate: string
  endDate: string
  promotionPrice: string
  websiteUrl: string
  attachment: string
}

const initialState: FormState = {
  title: '',
  description: '',
  type: 'Billboard Carousel',
  sourceType: 'External',
  category: 'services',
  linkedBusiness: '',
  linkedProduct: '',
  startDate: '',
  endDate: '',
  promotionPrice: '',
  websiteUrl: '',
  attachment: '',
}

const promotionTypes: PromotionTypeLabel[] = [
  'Billboard Carousel',
  'Latest Promotions',
  'Sponsored Deals',
]

const promotionSources: PromotionSourceLabel[] = ['External', 'Internal']

const promotionCategories: Array<{ value: PromotionCategory; label: string }> = [
  { value: 'services', label: 'Services' },
  { value: 'stay', label: 'Stay' },
  { value: 'dine', label: 'Dine' },
  { value: 'shop', label: 'Shops' },
  { value: 'event', label: 'Events' },
]

const categoryLabelByValue = Object.fromEntries(
  promotionCategories.map((item) => [item.value, item.label]),
) as Record<PromotionCategory, string>

function normalizeBusinessCategory(value?: string | null): PromotionCategory {
  const normalized = (value ?? '').trim().toLowerCase()
  if (normalized === 'shop' || normalized === 'shops') return 'shop'
  if (normalized === 'event' || normalized === 'events') return 'event'
  if (normalized === 'stay' || normalized === 'stays') return 'stay'
  if (normalized === 'dine') return 'dine'
  return 'services'
}

function getItemPrice(item: Record<string, unknown>) {
  const priceCandidate =
    item.price ??
    item.ticketPrice ??
    item.basePrice ??
    item.roomPrice ??
    0
  return Number(priceCandidate || 0)
}

const promotionTypeToApi: Record<PromotionTypeLabel, PromotionApiType> = {
  'Billboard Carousel': 'bilboard_courosel',
  'Latest Promotions': 'latest_promotions',
  'Sponsored Deals': 'sponsored_deals',
}

const apiToPromotionType: Record<PromotionApiType, PromotionTypeLabel> = {
  bilboard_courosel: 'Billboard Carousel',
  latest_promotions: 'Latest Promotions',
  sponsored_deals: 'Sponsored Deals',
}

function fromPromotion(doc: PromotionApiDoc): FormState {
  const sourceType: PromotionSourceLabel = doc.websiteUrl ? 'External' : 'Internal'
  return {
    title: doc.title,
    description: doc.description,
    type: apiToPromotionType[doc.type],
    sourceType,
    category: 'services',
    linkedBusiness: '',
    linkedProduct: '',
    startDate: doc.startDate.slice(0, 10),
    endDate: doc.endDate.slice(0, 10),
    promotionPrice: String(doc.promotionPrice),
    websiteUrl: doc.websiteUrl ?? '',
    attachment: doc.attachment,
  }
}

export function toCreatePromotionPayload(form: FormState): CreatePromotionPayload {
  const isExternal = form.sourceType === 'External'
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    type: promotionTypeToApi[form.type],
    startDate: `${form.startDate}T00:00:00.000Z`,
    endDate: `${form.endDate}T23:59:59.000Z`,
    promotionPrice: Number(form.promotionPrice),
    attachment: form.attachment,
    ...(isExternal && form.websiteUrl.trim()
      ? { websiteUrl: form.websiteUrl.trim() }
      : {}),
    ...(!isExternal && form.linkedBusiness
      ? { linkedBusiness: form.linkedBusiness }
      : {}),
    ...(!isExternal && form.linkedProduct ? { linkedProduct: form.linkedProduct } : {}),
  }
}

type Props = {
  open: boolean
  promotion?: PromotionApiDoc | null
  onClose: () => void
  onSubmit?: (payload: CreatePromotionPayload) => void | Promise<void>
  isSubmitting?: boolean
}

export default function AddPromotionModal({
  open,
  promotion = null,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const isEdit = Boolean(promotion)
  const [form, setForm] = useState<FormState>(initialState)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [getPresignedUrl] = useGetPresignedUploadUrlMutation()
  const { data: shopsData } = useGetShopsQuery({ page: 1, limit: 200 })
  const { data: productsData, isFetching: isProductsLoading } =
    useGetPromotionProductsQuery(
      {
        businessId: form.linkedBusiness,
        category: form.category,
      },
      { skip: form.sourceType !== 'Internal' || !form.linkedBusiness || !form.category },
    )

  const isBusy = isSubmitting || isUploading
  const hasImage = Boolean(attachmentFile || form.attachment)
  const isExternal = form.sourceType === 'External'

  const businessOptions = useMemo(
    () =>
      (shopsData?.data ?? []).map((shop) => ({
        value: shop._id,
        label: shop.businessName ?? shop.user.name ?? shop._id,
        category: normalizeBusinessCategory(shop.category),
      })),
    [shopsData],
  )

  const productOptions = useMemo(
    () =>
      (productsData?.data ?? []).map((item) => ({
        value: String(item._id ?? ''),
        label: String(item.name ?? 'Unnamed'),
        price: getItemPrice(item),
      })),
    [productsData],
  )

  const selectedProduct = useMemo(
    () => productOptions.find((product) => product.value === form.linkedProduct),
    [form.linkedProduct, productOptions],
  )

  useEffect(() => {
    if (!open) return
    setForm(promotion ? fromPromotion(promotion) : initialState)
    setAttachmentFile(null)
    setIsUploading(false)
  }, [open, promotion])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  useEffect(() => {
    if (form.sourceType === 'External') return
    if (!selectedProduct) return
    update('promotionPrice', String(selectedProduct.price))
  }, [form.sourceType, selectedProduct])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!attachmentFile && !form.attachment) return

    if (isExternal && !form.websiteUrl.trim()) {
      message.error('Website link is required for external promotion.')
      return
    }

    if (!isExternal) {
      if (!form.linkedBusiness) {
        message.error('Please select a business for internal promotion.')
        return
      }
      if (!form.linkedProduct) {
        message.error('Please select a product for internal promotion.')
        return
      }
    }

    let attachment = form.attachment

    if (attachmentFile) {
      setIsUploading(true)
      try {
        attachment = await uploadImageFile(attachmentFile, async (payload) => {
          const result = await getPresignedUrl(payload).unwrap()
          return result
        })
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Image upload failed.'
        message.error(errorMessage)
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }

    await onSubmit?.(
      toCreatePromotionPayload({ ...form, attachment }),
    )
  }

  const handleClose = () => {
    if (isBusy) return
    setForm(initialState)
    setAttachmentFile(null)
    onClose()
  }

  const handleSourceChange = (next: PromotionSourceLabel) => {
    setForm((prev) => ({
      ...prev,
      sourceType: next,
      websiteUrl: next === 'External' ? prev.websiteUrl : '',
      linkedBusiness: next === 'Internal' ? prev.linkedBusiness : '',
      linkedProduct: next === 'Internal' ? prev.linkedProduct : '',
      promotionPrice: next === 'External' ? prev.promotionPrice : '',
    }))
  }

  const handleBusinessChange = (value: string) => {
    const business = businessOptions.find((item) => item.value === value)
    setForm((prev) => ({
      ...prev,
      linkedBusiness: value,
      category: business?.category ?? prev.category,
      linkedProduct: '',
      promotionPrice: '',
    }))
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      closable={false}
      width={920}
      centered
      destroyOnClose
      styles={{ body: { padding: 0 } }}
      className="add-promotion-modal"
    >
      <form onSubmit={handleSubmit}>
        <header className="flex items-center gap-3 border-b border-surface-border px-7 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20 text-brand-hover">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isEdit ? 'Edit Promotion' : 'Add New Promotion'}
            </h2>
            <p className="text-xs text-gray-400">
              {isEdit
                ? 'Update the promotion details below.'
                : 'Fill in the details to publish a new promotion.'}
            </p>
          </div>
        </header>

        <div className="max-h-[70vh] overflow-y-auto px-7 py-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <FormControl label="Promotion Title" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Summer Discount Campaign"
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="Promotion Details" required>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Get up to 30% off on selected services during summer season."
                className={textareaClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="Promotion Type" required>
              <SelectField
                value={form.type}
                onChange={(v) => update('type', v as PromotionTypeLabel)}
                options={promotionTypes}
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="Placement Type" required>
              <SelectField
                value={form.sourceType}
                onChange={(v) => handleSourceChange(v as PromotionSourceLabel)}
                options={promotionSources}
                disabled={isBusy}
              />
            </FormControl>

            {!isExternal && (
              <FormControl label="Business" required>
                <SelectField
                  value={form.linkedBusiness}
                  onChange={handleBusinessChange}
                  options={businessOptions.map((item) => item.value)}
                  labels={Object.fromEntries(
                    businessOptions.map((item) => [item.value, item.label]),
                  )}
                  placeholder="Select business"
                  disabled={isBusy || businessOptions.length === 0}
                />
              </FormControl>
            )}

            {!isExternal && (
              <FormControl label="Category" required>
                <input
                  type="text"
                  value={categoryLabelByValue[form.category]}
                  className={controlClass + ' cursor-not-allowed opacity-50'}
                  disabled
                  
                />
              </FormControl>
            )}

            {!isExternal && (
              <FormControl label="Product" required>
                <SelectField
                  value={form.linkedProduct}
                  onChange={(v) => update('linkedProduct', v)}
                  options={productOptions.map((item) => item.value)}
                  labels={Object.fromEntries(
                    productOptions.map((item) => [item.value, item.label]),
                  )}
                  placeholder={
                    isProductsLoading ? 'Loading products...' : 'Select product'
                  }
                  disabled={
                    isBusy ||
                    isProductsLoading ||
                    !form.linkedBusiness ||
                    productOptions.length === 0
                  }
                />
              </FormControl>
            )}

            <FormControl
              label={
                isExternal
                  ? 'Promotion Price'
                  : 'Promotion Price (Auto from selected product)'
              }
              required
            >
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.promotionPrice}
                onChange={(e) => update('promotionPrice', e.target.value)}
                placeholder="30"
                className={controlClass + ` ${!isExternal ? 'cursor-not-allowed opacity-50' : ''}`}
                required
                disabled={isBusy || !isExternal}
              />
            </FormControl>

            <FormControl label="Promotion Start Date" required>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => update('startDate', e.target.value)}
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="Promotion End Date" required>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => update('endDate', e.target.value)}
                min={form.startDate || undefined}
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            {isExternal && (
              <FormControl label="Website Link" required>
                <input
                  type="url"
                  value={form.websiteUrl}
                  onChange={(e) => update('websiteUrl', e.target.value)}
                  placeholder="https://www.example.com/summer-sale"
                  className={controlClass}
                  disabled={isBusy}
                  required
                />
              </FormControl>
            )}

            <div className="lg:col-span-2">
              <ImageUploader
                label="Promotion Banner"
                required
                value={form.attachment}
                onFileSelect={setAttachmentFile}
                disabled={isBusy}
                hint="Select a banner image — it uploads when you submit"
              />
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-surface-border px-7 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            className="h-10 rounded-md border border-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isBusy || !hasImage}
            className="h-10 rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading
              ? 'Uploading image...'
              : isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                  ? 'Update Promotion'
                  : 'Create New Promotion'}
          </button>
        </footer>
      </form>
    </Modal>
  )
}

type SelectFieldProps = {
  value: string
  onChange: (value: string) => void
  options: string[]
  labels?: Record<string, string>
  placeholder?: string
  disabled?: boolean
}

function SelectField({
  value,
  onChange,
  options,
  labels,
  placeholder,
  disabled = false,
}: SelectFieldProps) {
  const selectOptions = options.map((opt) => ({
    value: opt,
    label: labels?.[opt] ?? opt,
  }))

  return (
    <div className="relative">
      <Select
        value={value || undefined}
        onChange={onChange}
        options={selectOptions}
        placeholder={placeholder}
        disabled={disabled}
        suffixIcon={<ChevronDown size={18} className="text-gray-400" />}
        popupMatchSelectWidth
        className="w-full [&_.ant-select-selector]:!h-12 py-3 [&_.ant-select-selector]:!rounded-md [&_.ant-select-selector]:!border-surface-border [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!px-3 [&_.ant-select-selector]:!py-1.5 [&_.ant-select-selection-item]:!text-white [&_.ant-select-selection-placeholder]:!text-gray-500"
        styles={{
          popup: {
            root: {
              backgroundColor: '#1f2128',
              border: '1px solid #303442',
              borderRadius: 8,
            },
          },
        }}
      />
    </div>
  )
}

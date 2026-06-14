import { useEffect, useState, type FormEvent } from 'react'
import { Modal, message } from 'antd'
import { ChevronDown, Sparkles } from 'lucide-react'
import FormControl, { controlClass, textareaClass } from './FormControl'
import ImageUploader from '../common/ImageUploader'
import {
  uploadImageFile,
  useGetPresignedUploadUrlMutation,
} from '../../redux/api/imageUploadApi'
import type {
  CreatePromotionPayload,
  PromotionApiDoc,
  PromotionApiType,
} from '../../redux/api/homeControllerApi'

type PromotionTypeLabel =
  | 'Billboard Carousel'
  | 'Latest Promotions'
  | 'Sponsored Deals'

type FormState = {
  title: string
  description: string
  type: PromotionTypeLabel
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
  return {
    title: doc.title,
    description: doc.description,
    type: apiToPromotionType[doc.type],
    startDate: doc.startDate.slice(0, 10),
    endDate: doc.endDate.slice(0, 10),
    promotionPrice: String(doc.promotionPrice),
    websiteUrl: doc.websiteUrl ?? '',
    attachment: doc.attachment,
  }
}

export function toCreatePromotionPayload(form: FormState): CreatePromotionPayload {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    type: promotionTypeToApi[form.type],
    startDate: `${form.startDate}T00:00:00.000Z`,
    endDate: `${form.endDate}T23:59:59.000Z`,
    promotionPrice: Number(form.promotionPrice),
    attachment: form.attachment,
    ...(form.websiteUrl.trim() ? { websiteUrl: form.websiteUrl.trim() } : {}),
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

  const isBusy = isSubmitting || isUploading
  const hasImage = Boolean(attachmentFile || form.attachment)

  useEffect(() => {
    if (!open) return
    setForm(promotion ? fromPromotion(promotion) : initialState)
    setAttachmentFile(null)
    setIsUploading(false)
  }, [open, promotion])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!attachmentFile && !form.attachment) return

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

            <FormControl label="Promotion Price" required>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.promotionPrice}
                onChange={(e) => update('promotionPrice', e.target.value)}
                placeholder="30"
                className={controlClass}
                required
                disabled={isBusy}
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

            <FormControl label="Website Link">
              <input
                type="url"
                value={form.websiteUrl}
                onChange={(e) => update('websiteUrl', e.target.value)}
                placeholder="https://www.example.com/summer-sale"
                className={controlClass}
                disabled={isBusy}
              />
            </FormControl>

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
  placeholder?: string
  disabled?: boolean
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${controlClass} appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className="pointer-events-none absolute inset-y-0 right-3 my-auto text-gray-400"
      />
    </div>
  )
}

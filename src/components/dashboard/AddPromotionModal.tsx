import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Modal } from 'antd'
import { ChevronDown, Sparkles, Upload } from 'lucide-react'
import FormControl, { controlClass, textareaClass } from './FormControl'

type PromotionType =
  | 'Billboard Carousel'
  | 'Latest Promotions'
  | 'Sponsored Deals'

type FormState = {
  title: string
  details: string
  type: PromotionType
  startDate: string
  endDate: string
  shop: string
  product: string
  price: string
  websiteLink: string
  media: File | null
}

const initialState: FormState = {
  title: '',
  details: '',
  type: 'Billboard Carousel',
  startDate: '',
  endDate: '',
  shop: '',
  product: '',
  price: '',
  websiteLink: '',
  media: null,
}

const promotionTypes: PromotionType[] = [
  'Billboard Carousel',
  'Latest Promotions',
  'Sponsored Deals',
]

const shops = ['Burger King', 'Solaris Energy', 'Blue Note Lounge']
const products = ['Burger', 'Fries', 'Coffee', 'Cocktail']

type Props = {
  open: boolean
  onClose: () => void
  onSubmit?: (data: FormState) => void
}

export default function AddPromotionModal({ open, onClose, onSubmit }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<FormState>(initialState)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    update('media', file)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit?.(form)
    setForm(initialState)
    onClose()
  }

  const handleClose = () => {
    setForm(initialState)
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
              Add New Promotion
            </h2>
            <p className="text-xs text-gray-400">
              Fill in the details to publish a new promotion.
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
                placeholder="Sabbir Ahmed"
                className={controlClass}
                required
              />
            </FormControl>

            <FormControl label="Promotion Details">
              <textarea
                value={form.details}
                onChange={(e) => update('details', e.target.value)}
                placeholder="An intimate evening of smooth jazz and cocktails at the Blue Note Lounge."
                className={textareaClass}
              />
            </FormControl>

            <FormControl label="Promotion Type" required>
              <SelectField
                value={form.type}
                onChange={(v) => update('type', v as PromotionType)}
                options={promotionTypes}
              />
            </FormControl>

            <FormControl label="Promotion start Date" required>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => update('startDate', e.target.value)}
                className={controlClass}
                required
              />
            </FormControl>

            <FormControl label="Promotion End Date" required>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => update('endDate', e.target.value)}
                className={controlClass}
                required
              />
            </FormControl>

            <FormControl label="Select Shop" required>
              <SelectField
                value={form.shop}
                onChange={(v) => update('shop', v)}
                options={shops}
                placeholder="Select a shop"
              />
            </FormControl>

            <FormControl label="Select Product" required>
              <SelectField
                value={form.product}
                onChange={(v) => update('product', v)}
                options={products}
                placeholder="Select a product"
              />
            </FormControl>

            <FormControl label="Product Price" required>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                placeholder="$50.00"
                className={controlClass}
                required
              />
            </FormControl>

            <FormControl label="Add Website Link">
              <input
                type="url"
                value={form.websiteLink}
                onChange={(e) => update('websiteLink', e.target.value)}
                placeholder="https://example.com"
                className={controlClass}
              />
            </FormControl>

            <FormControl label="Upload picture/Video">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-brand bg-transparent text-sm text-gray-300 transition-colors hover:bg-brand/5"
              >
                <Upload size={26} />
                <span className="truncate px-4">
                  {form.media ? form.media.name : 'Upload Media Picture'}
                </span>
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*,video/*"
                onChange={onFileChange}
                className="hidden"
              />
            </FormControl>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-surface-border px-7 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="h-10 rounded-md border border-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-10 rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Create New Promotion
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
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClass} appearance-none pr-10`}
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

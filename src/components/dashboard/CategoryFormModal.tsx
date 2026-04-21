import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { Modal, message } from 'antd'
import { Boxes, ImagePlus, Plus, X } from 'lucide-react'
import FormControl, { controlClass } from './FormControl'
import {
  nextSubCategoryId,
  type Category,
  type SubCategory,
} from './categoryData'

export type CategoryFormState = {
  name: string
  imageUrl: string
  subCategories: SubCategory[]
}

const blankState: CategoryFormState = {
  name: '',
  imageUrl: '',
  subCategories: [],
}

const fromCategory = (c: Category): CategoryFormState => ({
  name: c.name,
  imageUrl: c.imageUrl,
  subCategories: c.subCategories.map((s) => ({ ...s })),
})

type Props = {
  open: boolean
  category: Category | null
  onClose: () => void
  onSubmit: (data: CategoryFormState) => void
}

export default function CategoryFormModal({
  open,
  category,
  onClose,
  onSubmit,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<CategoryFormState>(blankState)
  const [subInput, setSubInput] = useState('')

  useEffect(() => {
    if (!open) return
    setForm(category ? fromCategory(category) : blankState)
    setSubInput('')
  }, [open, category])

  const isEdit = category !== null

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) }))
  }

  const addSub = () => {
    const name = subInput.trim()
    if (!name) return
    if (
      form.subCategories.some(
        (s) => s.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      message.warning('Sub-category already exists.')
      return
    }
    setForm((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, { id: nextSubCategoryId(), name }],
    }))
    setSubInput('')
  }

  const removeSub = (id: string) =>
    setForm((prev) => ({
      ...prev,
      subCategories: prev.subCategories.filter((s) => s.id !== id),
    }))

  const onSubKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSub()
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      message.warning('Category name is required.')
      return
    }
    if (!form.imageUrl) {
      message.warning('Upload a category image.')
      return
    }
    onSubmit({ ...form, name: form.name.trim() })
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={720}
      centered
      destroyOnClose
      styles={{ body: { padding: 0 } }}
      className="add-promotion-modal"
    >
      <form onSubmit={handleSubmit}>
        <header className="flex items-center gap-3 border-b border-surface-border px-7 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20 text-brand-hover">
            <Boxes size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isEdit ? 'Edit Category' : 'New Category'}
            </h2>
            <p className="text-xs text-gray-400">
              Pick a name, cover image, and list the sub-categories.
            </p>
          </div>
        </header>

        <div className="max-h-[72vh] overflow-y-auto px-7 py-6">
          <div className="space-y-5">
            <FormControl label="Cover Image" required>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="group relative flex h-48 w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-brand bg-transparent transition-colors hover:bg-brand/5"
              >
                {form.imageUrl ? (
                  <>
                    <img
                      src={form.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex items-center gap-2 rounded-md bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
                        <ImagePlus size={14} />
                        Change image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <ImagePlus size={28} />
                    <span className="text-sm">Click to upload category image</span>
                    <span className="text-[11px] text-gray-500">
                      Recommended: 1200×750 px
                    </span>
                  </div>
                )}
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
              />
            </FormControl>

            <FormControl label="Category Name" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Electronics"
                className={controlClass}
                required
              />
            </FormControl>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  Sub-categories
                </span>
                <span className="text-xs text-gray-400">
                  {form.subCategories.length}{' '}
                  {form.subCategories.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={subInput}
                  onChange={(e) => setSubInput(e.target.value)}
                  onKeyDown={onSubKeyDown}
                  placeholder="Type a sub-category name and press Enter"
                  className={controlClass}
                />
                <button
                  type="button"
                  onClick={addSub}
                  disabled={!subInput.trim()}
                  className="flex h-12 shrink-0 items-center gap-1.5 rounded-md bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={15} />
                  Add
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {form.subCategories.length === 0 ? (
                  <div className="flex w-full items-center justify-center rounded-md border border-dashed border-surface-border py-6 text-xs text-gray-400">
                    No sub-categories added yet.
                  </div>
                ) : (
                  form.subCategories.map((sub) => (
                    <span
                      key={sub.id}
                      className="flex items-center gap-1.5 rounded-full border border-surface-border bg-surface-elevated py-1 pl-3 pr-1 text-sm text-white"
                    >
                      {sub.name}
                      <button
                        type="button"
                        aria-label={`Remove ${sub.name}`}
                        onClick={() => removeSub(sub.id)}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-surface-border px-7 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-10 rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            {isEdit ? 'Save Changes' : 'Create Category'}
          </button>
        </footer>
      </form>
    </Modal>
  )
}

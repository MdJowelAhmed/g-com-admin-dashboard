import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Modal, Spin, message } from 'antd'
import { Boxes, Pencil, Plus, X } from 'lucide-react'
import FormControl, { controlClass } from './FormControl'
import {
  CATEGORY_TO_API,
  type Category,
  type SubCategory,
} from './categoryData'
import {
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetSubCategoriesQuery,
  useUpdateSubCategoryMutation,
} from '../../redux/api/subCategoryApi'

type Props = {
  open: boolean
  category: Category | null
  onClose: () => void
}

export default function CategoryFormModal({ open, category, onClose }: Props) {
  const [subInput, setSubInput] = useState('')
  const [editingSubId, setEditingSubId] = useState<string | null>(null)
  const [editingSubName, setEditingSubName] = useState('')

  const apiCategory = category ? CATEGORY_TO_API[category.key] : ''
  const { data, isLoading, isFetching } = useGetSubCategoriesQuery(
    { category: apiCategory },
    { skip: !open || !apiCategory },
  )

  const [createSubCategory, { isLoading: isCreating }] =
    useCreateSubCategoryMutation()
  const [updateSubCategory, { isLoading: isUpdating }] =
    useUpdateSubCategoryMutation()
  const [deleteSubCategory, { isLoading: isDeleting }] =
    useDeleteSubCategoryMutation()

  const isBusy = isCreating || isUpdating || isDeleting
  const subCategories: SubCategory[] = data?.data?.map((doc) => ({
    id: doc._id,
    name: doc.name,
    status: doc.status,
  })) ?? []

  useEffect(() => {
    if (!open) return
    setSubInput('')
    setEditingSubId(null)
    setEditingSubName('')
  }, [open, category?.key])

  const addSub = async () => {
    const name = subInput.trim()
    if (!name || !apiCategory) return

    if (
      subCategories.some((sub) => sub.name.toLowerCase() === name.toLowerCase())
    ) {
      message.warning('Sub-category already exists.')
      return
    }

    try {
      const result = await createSubCategory({
        name,
        category: apiCategory,
      }).unwrap()
      message.success(result.message || 'Sub-category created successfully.')
      setSubInput('')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create sub-category.'
      message.error(errorMessage)
    }
  }

  const removeSub = async (sub: SubCategory) => {
    try {
      const result = await deleteSubCategory(sub.id).unwrap()
      message.success(result.message || 'Sub-category deleted successfully.')
      if (editingSubId === sub.id) {
        setEditingSubId(null)
        setEditingSubName('')
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete sub-category.'
      message.error(errorMessage)
    }
  }

  const startEditSub = (sub: SubCategory) => {
    setEditingSubId(sub.id)
    setEditingSubName(sub.name)
  }

  const saveEditSub = async () => {
    if (!editingSubId || !apiCategory) return

    const name = editingSubName.trim()
    if (!name) {
      message.warning('Sub-category name is required.')
      return
    }

    const current = subCategories.find((sub) => sub.id === editingSubId)
    if (!current || current.name === name) {
      setEditingSubId(null)
      setEditingSubName('')
      return
    }

    try {
      const result = await updateSubCategory({
        id: editingSubId,
        body: { name, category: apiCategory },
      }).unwrap()
      message.success(result.message || 'Sub-category updated successfully.')
      setEditingSubId(null)
      setEditingSubName('')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update sub-category.'
      message.error(errorMessage)
    }
  }

  const onSubKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      void addSub()
    }
  }

  const onEditSubKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      void saveEditSub()
    }
    if (e.key === 'Escape') {
      setEditingSubId(null)
      setEditingSubName('')
    }
  }

  const handleClose = () => {
    if (isBusy) return
    onClose()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleClose()
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
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
              Manage {category?.name ?? 'Category'}
            </h2>
            <p className="text-xs text-gray-400">
              Add, edit, or remove sub-categories for this hub.
            </p>
          </div>
        </header>

        <div className="max-h-[72vh] overflow-y-auto px-7 py-6">
          <div className="space-y-5">
            <FormControl label="Cover Image">
              <div className="relative flex h-48 w-full overflow-hidden rounded-md border border-surface-border bg-surface-elevated">
                {category?.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
            </FormControl>

            <FormControl label="Category Name">
              <input
                type="text"
                value={category?.name ?? ''}
                readOnly
                className={`${controlClass} cursor-not-allowed opacity-70`}
              />
            </FormControl>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  Sub-categories
                </span>
                <span className="text-xs text-gray-400">
                  {subCategories.length}{' '}
                  {subCategories.length === 1 ? 'item' : 'items'}
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
                  disabled={isBusy}
                />
                <button
                  type="button"
                  onClick={() => void addSub()}
                  disabled={!subInput.trim() || isBusy}
                  className="flex h-12 shrink-0 items-center gap-1.5 rounded-md bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={15} />
                  Add
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {isLoading || isFetching ? (
                  <div className="flex w-full items-center justify-center py-8">
                    <Spin />
                  </div>
                ) : subCategories.length === 0 ? (
                  <div className="flex w-full items-center justify-center rounded-md border border-dashed border-surface-border py-6 text-xs text-gray-400">
                    No sub-categories added yet.
                  </div>
                ) : (
                  subCategories.map((sub) => (
                    <span
                      key={sub.id}
                      className="flex items-center gap-1.5 rounded-full border border-surface-border bg-surface-elevated py-1 pl-3 pr-1 text-sm text-white"
                    >
                      {editingSubId === sub.id ? (
                        <input
                          type="text"
                          value={editingSubName}
                          onChange={(e) => setEditingSubName(e.target.value)}
                          onKeyDown={onEditSubKeyDown}
                          onBlur={() => void saveEditSub()}
                          autoFocus
                          disabled={isBusy}
                          className="w-28 bg-transparent text-sm text-white outline-none"
                        />
                      ) : (
                        <>
                          <span>{sub.name}</span>
                          {sub.status === 'archive' && (
                            <span className="text-[10px] uppercase text-gray-400">
                              archived
                            </span>
                          )}
                        </>
                      )}
                      <button
                        type="button"
                        aria-label={`Edit ${sub.name}`}
                        onClick={() => startEditSub(sub)}
                        disabled={isBusy}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-brand/20 hover:text-brand-hover disabled:opacity-50"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${sub.name}`}
                        onClick={() => void removeSub(sub)}
                        disabled={isBusy}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
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
            onClick={handleClose}
            disabled={isBusy}
            className="h-10 rounded-md border border-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isBusy}
            className="h-10 rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            Done
          </button>
        </footer>
      </form>
    </Modal>
  )
}

import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from 'antd'
import { ShieldCheck } from 'lucide-react'
import FormControl, { controlClass } from './FormControl'
import {
  PAGE_PERMISSIONS,
  type Controller,
  type PagePermission,
} from './controllerData'

export type ControllerFormState = {
  name: string
  email: string
  pageAccess: PagePermission[]
}

const blankState: ControllerFormState = {
  name: '',
  email: '',
  pageAccess: [],
}

const fromController = (c: Controller): ControllerFormState => ({
  name: c.name,
  email: c.email,
  pageAccess: [...c.pageAccess],
})

type Props = {
  open: boolean
  controller: Controller | null
  onClose: () => void
  onSubmit: (data: ControllerFormState) => void | Promise<void>
  isSubmitting?: boolean
}

export default function ControllerFormModal({
  open,
  controller,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const [form, setForm] = useState<ControllerFormState>(blankState)

  useEffect(() => {
    if (!open) return
    setForm(controller ? fromController(controller) : blankState)
  }, [open, controller])

  const isEdit = controller !== null

  const togglePermission = (perm: PagePermission) =>
    setForm((prev) => ({
      ...prev,
      pageAccess: prev.pageAccess.includes(perm)
        ? prev.pageAccess.filter((p) => p !== perm)
        : [...prev.pageAccess, perm],
    }))

  const toggleAll = () =>
    setForm((prev) => ({
      ...prev,
      pageAccess:
        prev.pageAccess.length === PAGE_PERMISSIONS.length
          ? []
          : [...PAGE_PERMISSIONS],
    }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit(form)
  }

  const allSelected = form.pageAccess.length === PAGE_PERMISSIONS.length

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
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isEdit ? 'Edit Controller' : 'Add New Controller'}
            </h2>
            <p className="text-xs text-gray-400">
              Grant a teammate access to specific dashboard pages.
            </p>
          </div>
        </header>

        <div className="max-h-[70vh] overflow-y-auto px-7 py-6">
          <div className="grid grid-cols-1 gap-5">
            <FormControl label="Full Name" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Sabbir Ahmed"
                className={controlClass}
                required
                disabled={isSubmitting}
              />
            </FormControl>

            <FormControl label="Email Address" required>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="rpsabbir.ahmed@gmail.com"
                className={controlClass}
                required
                disabled={isSubmitting}
              />
            </FormControl>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  Page Access Permissions
                  <span className="ml-1 text-accent-amber">*</span>
                </span>
                <button
                  type="button"
                  onClick={toggleAll}
                  disabled={isSubmitting}
                  className="text-xs font-medium text-accent-amber hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {allSelected ? 'Clear all' : 'Select all'}
                </button>
              </div>

              <div className="rounded-md border border-brand p-4">
                <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {PAGE_PERMISSIONS.map((perm) => {
                    const checked = form.pageAccess.includes(perm)
                    return (
                      <label
                        key={perm}
                        className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
                          checked
                            ? 'bg-brand/15 text-white'
                            : 'text-gray-300 hover:bg-surface-elevated hover:text-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermission(perm)}
                          disabled={isSubmitting}
                          className="sr-only"
                        />
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            checked
                              ? 'border-brand bg-brand'
                              : 'border-surface-border'
                          }`}
                        >
                          {checked && (
                            <svg
                              viewBox="0 0 16 16"
                              className="h-3 w-3 text-white"
                              fill="none"
                            >
                              <path
                                d="M3 8l3 3 7-7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="truncate" title={perm}>
                          {perm}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-400">
                {form.pageAccess.length} of {PAGE_PERMISSIONS.length} pages selected
              </div>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-surface-border px-7 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 rounded-md border border-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || form.pageAccess.length === 0}
            className="h-10 rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? isEdit
                ? 'Saving...'
                : 'Creating...'
              : isEdit
                ? 'Save Changes'
                : 'Create Controller'}
          </button>
        </footer>
      </form>
    </Modal>
  )
}

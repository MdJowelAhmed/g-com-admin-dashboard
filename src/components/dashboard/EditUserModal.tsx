import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from 'antd'
import { ChevronDown } from 'lucide-react'
import FormControl, { controlClass } from './FormControl'
import { USER_STATUSES, type User, type UserStatus } from './userData'

type FormState = {
  name: string
  email: string
  phone: string
  address: string
  status: UserStatus
}

const initial = (user: User): FormState => ({
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  status: user.status,
})

type Props = {
  user: User | null
  open: boolean
  onClose: () => void
  onSave: (key: string, patch: FormState) => void
}

export default function EditUserModal({ user, open, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormState | null>(null)

  useEffect(() => {
    if (user && open) setForm(initial(user))
  }, [user, open])

  if (!user || !form) {
    return (
      <Modal open={open} onCancel={onClose} footer={null} title="Edit User" destroyOnClose />
    )
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave(user.key, form)
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Edit User"
      centered
      destroyOnClose
      width={560}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormControl label="Name" required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={controlClass}
            required
          />
        </FormControl>

        <FormControl label="Email" required>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={controlClass}
            required
          />
        </FormControl>

        <div className="grid grid-cols-2 gap-4">
          <FormControl label="Phone">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className={controlClass}
            />
          </FormControl>

          <FormControl label="Status" required>
            <div className="relative">
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value as UserStatus)}
                className={`${controlClass} appearance-none pr-10`}
              >
                {USER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute inset-y-0 right-3 my-auto text-gray-400"
              />
            </div>
          </FormControl>
        </div>

        <FormControl label="Address">
          <input
            type="text"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className={controlClass}
          />
        </FormControl>

        <div className="flex items-center justify-end gap-3 pt-2">
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
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  )
}

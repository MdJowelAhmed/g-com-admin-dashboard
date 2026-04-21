import { useState, type FormEvent } from 'react'
import { message } from 'antd'
import { Eye, EyeOff } from 'lucide-react'
import FormControl, { controlClass } from '../FormControl'

type PasswordForm = {
  current: string
  next: string
  confirm: string
}

const MIN_LENGTH = 8
const EMPTY: PasswordForm = { current: '', next: '', confirm: '' }

export default function ChangePasswordTab() {
  const [form, setForm] = useState<PasswordForm>(EMPTY)
  const [visible, setVisible] = useState<Record<keyof PasswordForm, boolean>>({
    current: false,
    next: false,
    confirm: false,
  })
  const [error, setError] = useState<string | null>(null)

  const toggle = (key: keyof PasswordForm) =>
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }))

  const update = (key: keyof PasswordForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (form.next.length < MIN_LENGTH) {
      setError(`Password must be at least ${MIN_LENGTH} characters.`)
      return
    }
    if (form.next !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setError(null)
    message.success('Password updated')
    setForm(EMPTY)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Change password</h2>
        <p className="text-sm text-gray-400">
          Use a password you don't reuse anywhere else.
        </p>
      </div>

      <div className="max-w-lg space-y-5">
        <PasswordField
          label="Current password"
          visible={visible.current}
          value={form.current}
          onChange={(v) => update('current', v)}
          onToggle={() => toggle('current')}
        />
        <PasswordField
          label="New password"
          visible={visible.next}
          value={form.next}
          onChange={(v) => update('next', v)}
          onToggle={() => toggle('next')}
          hint={`Must be at least ${MIN_LENGTH} characters.`}
        />
        <PasswordField
          label="Confirm new password"
          visible={visible.confirm}
          value={form.confirm}
          onChange={(v) => update('confirm', v)}
          onToggle={() => toggle('confirm')}
        />

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-surface-border pt-5">
        <button
          type="button"
          onClick={() => setForm(EMPTY)}
          className="h-10 rounded-md border border-surface-border px-5 text-sm font-medium text-gray-300 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-10 rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          Update password
        </button>
      </div>
    </form>
  )
}

type PasswordFieldProps = {
  label: string
  value: string
  visible: boolean
  onChange: (value: string) => void
  onToggle: () => void
  hint?: string
}

function PasswordField({
  label,
  value,
  visible,
  onChange,
  onToggle,
  hint,
}: PasswordFieldProps) {
  return (
    <FormControl label={label} required>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${controlClass} pr-10`}
          required
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-3 my-auto flex h-7 w-7 items-center justify-center text-gray-400 hover:text-white"
        >
          {visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
      {hint && <div className="mt-1.5 text-xs text-gray-400">{hint}</div>}
    </FormControl>
  )
}

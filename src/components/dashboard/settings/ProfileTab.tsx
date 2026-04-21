import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { message } from 'antd'
import { Camera } from 'lucide-react'
import FormControl, { controlClass } from '../FormControl'

type ProfileForm = {
  name: string
  email: string
  phone: string
  location: string
  bio: string
}

const initial: ProfileForm = {
  name: 'Sabbir Ahmed',
  email: 'sabbir.ahmed@gcom.app',
  phone: '+880 1722 330110',
  location: 'Elmina Castle, Ghana',
  bio: 'Admin and product lead at G-com.',
}

export default function ProfileTab() {
  const [form, setForm] = useState<ProfileForm>(initial)
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const update = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatar(URL.createObjectURL(file))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    message.success('Profile updated')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <p className="text-sm text-gray-400">
          Keep your personal details up to date.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-surface-elevated text-xl font-semibold text-white">
            {avatar ? (
              <img src={avatar} alt={form.name} className="h-full w-full object-cover" />
            ) : (
              form.name.charAt(0)
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            aria-label="Change avatar"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white shadow hover:bg-brand-hover"
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
        <div>
          <div className="text-base font-semibold text-white">{form.name}</div>
          <div className="text-xs text-gray-400">{form.email}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FormControl label="Full Name" required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={controlClass}
            required
          />
        </FormControl>
        <FormControl label="Email Address" required>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={controlClass}
            required
          />
        </FormControl>
        <FormControl label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={controlClass}
          />
        </FormControl>
        <FormControl label="Location">
          <input
            type="text"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            className={controlClass}
          />
        </FormControl>
      </div>

      <FormControl label="Bio">
        <textarea
          value={form.bio}
          onChange={(e) => update('bio', e.target.value)}
          rows={3}
          className={`${controlClass} h-auto py-3`}
        />
      </FormControl>

      <div className="flex items-center justify-end gap-3 border-t border-surface-border pt-5">
        <button
          type="button"
          onClick={() => setForm(initial)}
          className="h-10 rounded-md border border-surface-border px-5 text-sm font-medium text-gray-300 hover:text-white"
        >
          Reset
        </button>
        <button
          type="submit"
          className="h-10 rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}

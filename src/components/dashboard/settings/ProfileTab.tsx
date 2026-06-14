import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { message, Spin } from 'antd'
import { Camera, Loader2 } from 'lucide-react'
import FormControl, { controlClass } from '../FormControl'
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from '../../../redux/api/authApi'
import {
  uploadImageFile,
  useGetPresignedUploadUrlMutation,
} from '../../../redux/api/imageUploadApi'

type ProfileForm = {
  name: string
  email: string
  phone: string
  address: string
  profileImage: string
}

const emptyForm: ProfileForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  profileImage: '',
}

export default function ProfileTab() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [saved, setSaved] = useState<ProfileForm>(emptyForm)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { data, isLoading, isError } = useGetMyProfileQuery()
  const [updateMyProfile, { isLoading: isUpdating }] =
    useUpdateMyProfileMutation()
  const [getPresignedUrl] = useGetPresignedUploadUrlMutation()

  const isBusy = isUpdating || isUploading

  useEffect(() => {
    const profile = data?.data
    if (!profile) return

    const nextForm: ProfileForm = {
      name: profile.name ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      address: profile.address ?? '',
      profileImage: profile.profileImage || profile.image || '',
    }

    setForm(nextForm)
    setSaved(nextForm)
    setProfileImageFile(null)
    setPreviewUrl(null)
  }, [data])

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const update = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      message.warning('Please select an image file.')
      return
    }

    setProfileImageFile(file)
    setPreviewUrl((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      return URL.createObjectURL(file)
    })
  }

  const clearImageSelection = () => {
    setProfileImageFile(null)
    setPreviewUrl((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      return null
    })
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    let profileImage = form.profileImage

    if (profileImageFile) {
      setIsUploading(true)
      try {
        profileImage = await uploadImageFile(
          profileImageFile,
          async (payload) => {
            const result = await getPresignedUrl(payload).unwrap()
            return result
          },
        )
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Image upload failed.'
        message.error(errorMessage)
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }

    try {
      const result = await updateMyProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        ...(profileImage ? { profileImage } : {}),
      }).unwrap()

      const nextForm = { ...form, profileImage }
      setForm(nextForm)
      setSaved(nextForm)
      clearImageSelection()
      message.success(result.message || 'Profile updated successfully.')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update profile.'
      message.error(errorMessage)
    }
  }

  const reset = () => {
    setForm(saved)
    clearImageSelection()
  }

  const avatarUrl = previewUrl || form.profileImage
  const dirty =
    form.name !== saved.name ||
    form.phone !== saved.phone ||
    form.address !== saved.address ||
    profileImageFile !== null

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spin size="large" />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-sm text-red-400">
        Failed to load profile. Please try again.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <p className="text-sm text-gray-400">
          Keep your personal details up to date.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={isBusy}
            aria-label="Change profile photo"
            className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-surface-elevated transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? (
              <Loader2 size={28} className="animate-spin text-brand" />
            ) : avatarUrl ? (
              <img
                src={avatarUrl}
                alt={form.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-semibold text-white">
                {form.name.charAt(0) || '?'}
              </span>
            )}

            {!isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={24} className="text-white" />
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={isBusy}
            aria-label="Upload profile photo"
            className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Camera size={16} />
          </button>

          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            disabled={isBusy}
            className="hidden"
          />
        </div>

        <div className="min-w-0">
          <div className="text-lg font-semibold text-white">{form.name}</div>
          <div className="mt-1 text-sm text-gray-400">{form.email}</div>
          <p className="mt-2 text-xs text-gray-500">
            Click the photo to upload a new profile image.
          </p>
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
            disabled={isBusy}
          />
        </FormControl>
        <FormControl label="Email Address" required>
          <input
            type="email"
            value={form.email}
            className={`${controlClass} cursor-not-allowed opacity-70`}
            readOnly
            disabled
          />
        </FormControl>
        <FormControl label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={controlClass}
            disabled={isBusy}
          />
        </FormControl>
        <FormControl label="Address">
          <input
            type="text"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className={controlClass}
            disabled={isBusy}
          />
        </FormControl>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-surface-border pt-5">
        <button
          type="button"
          onClick={reset}
          disabled={isBusy || !dirty}
          className="h-10 rounded-md border border-surface-border px-5 text-sm font-medium text-gray-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isBusy || !dirty}
          className="h-10 rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading
            ? 'Uploading image...'
            : isUpdating
              ? 'Saving...'
              : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

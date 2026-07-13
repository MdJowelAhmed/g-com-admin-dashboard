import { useEffect, useState, type FormEvent } from 'react'
import { Modal, message } from 'antd'
import { CalendarPlus } from 'lucide-react'
import FormControl, { controlClass, textareaClass } from './FormControl'
import ImageUploader from '../common/ImageUploader'
import {
  uploadImageFile,
  useGetPresignedUploadUrlMutation,
} from '../../redux/api/imageUploadApi'
import {
  toEventPayload,
  type EventPayload,
} from '../../redux/api/eventApi'
import { revenueOf, type EventRecord } from './eventData'

export type EventFormState = {
  name: string
  description: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  registrationDeadline: string
  latitude: string
  longitude: string
  maxCapacity: number
  ticketPrice: number
  organizerName: string
  image: string
}

const blankState: EventFormState = {
  name: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  registrationDeadline: '',
  latitude: '23.7793',
  longitude: '90.3989',
  maxCapacity: 0,
  ticketPrice: 0,
  organizerName: '',
  image: '',
}

const fromEvent = (event: EventRecord): EventFormState => ({
  name: event.name,
  description: event.about,
  startDate: event.startDateInput ?? '',
  startTime: event.startTimeInput ?? '',
  endDate: event.endDate ?? '',
  endTime: event.endTime ?? '',
  registrationDeadline: event.registrationDeadline ?? '',
  latitude: event.latitude != null ? String(event.latitude) : '23.7793',
  longitude: event.longitude != null ? String(event.longitude) : '90.3989',
  maxCapacity: event.capacity,
  ticketPrice: event.ticketPrice,
  organizerName: event.organizer,
  image: event.image ?? '',
})

type Props = {
  open: boolean
  event: EventRecord | null
  onClose: () => void
  onSubmit: (payload: EventPayload) => void | Promise<void>
  isSubmitting?: boolean
}

export default function EventFormModal({
  open,
  event,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const [form, setForm] = useState<EventFormState>(blankState)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [getPresignedUrl] = useGetPresignedUploadUrlMutation()

  const isBusy = isSubmitting || isUploading
  const hasImage = Boolean(imageFile || form.image)
  const isEdit = event !== null

  useEffect(() => {
    if (!open) return
    setForm(event ? fromEvent(event) : blankState)
    setImageFile(null)
    setIsUploading(false)
  }, [open, event])

  const update = <K extends keyof EventFormState>(
    key: K,
    value: EventFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const today = new Date().toISOString().slice(0, 10)
  const endDateMin = form.startDate && form.startDate > today ? form.startDate : today

  const handleStartDateChange = (nextStartDate: string) => {
    setForm((prev) => ({
      ...prev,
      startDate: nextStartDate,
      endDate:
        prev.endDate && nextStartDate && prev.endDate < nextStartDate
          ? ''
          : prev.endDate,
      registrationDeadline:
        prev.registrationDeadline &&
        nextStartDate &&
        prev.registrationDeadline > nextStartDate
          ? ''
          : prev.registrationDeadline,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!imageFile && !form.image) return

    if (form.startDate < today) {
      message.error('Start date cannot be in the past.')
      return
    }

    if (form.endDate < form.startDate) {
      message.error('End date cannot be earlier than start date.')
      return
    }

    if (
      form.registrationDeadline < today ||
      (form.startDate && form.registrationDeadline > form.startDate)
    ) {
      message.error(
        'Registration deadline must be today or later, and on or before start date.',
      )
      return
    }

    let imageUrl = form.image

    if (imageFile) {
      setIsUploading(true)
      try {
        imageUrl = await uploadImageFile(imageFile, async (payload) => {
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

    await onSubmit(toEventPayload(form, imageUrl))
  }

  const handleClose = () => {
    if (isBusy) return
    onClose()
  }

  const revenuePotential = revenueOf({
    seatSales: form.maxCapacity,
    ticketPrice: form.ticketPrice,
  })

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
            <CalendarPlus size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isEdit ? 'Edit Event' : 'Create New Event'}
            </h2>
            <p className="text-xs text-gray-400">
              {isEdit
                ? 'Update event details and save changes.'
                : 'Fill in the details to publish a new event.'}
            </p>
          </div>
        </header>

        <div className="max-h-[72vh] overflow-y-auto px-7 py-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <FormControl label="Event Title" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="National Environment Event"
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="Organizer Name" required>
              <input
                type="text"
                value={form.organizerName}
                onChange={(e) => update('organizerName', e.target.value)}
                placeholder="Evently"
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <div className="lg:col-span-2">
              <FormControl label="Event Description" required>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="This is event description"
                  className={textareaClass}
                  required
                  disabled={isBusy}
                />
              </FormControl>
            </div>

            <FormControl label="Start Date" required>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                min={today}
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="Start Time" required>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => update('startTime', e.target.value)}
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="End Date" required>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => update('endDate', e.target.value)}
                min={endDateMin}
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="End Time" required>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => update('endTime', e.target.value)}
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="Registration Deadline" required>
              <input
                type="date"
                value={form.registrationDeadline}
                onChange={(e) =>
                  update('registrationDeadline', e.target.value)
                }
                min={today}
                max={form.startDate || undefined}
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="Max Capacity" required>
              <input
                type="number"
                min={1}
                value={form.maxCapacity || ''}
                onChange={(e) =>
                  update('maxCapacity', Number(e.target.value) || 0)
                }
                placeholder="100"
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="Ticket Price" required>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.ticketPrice || ''}
                onChange={(e) =>
                  update('ticketPrice', Number(e.target.value) || 0)
                }
                placeholder="300"
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="Latitude" required>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => update('latitude', e.target.value)}
                placeholder="23.7793"
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <FormControl label="Longitude" required>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => update('longitude', e.target.value)}
                placeholder="90.3989"
                className={controlClass}
                required
                disabled={isBusy}
              />
            </FormControl>

            <div className="lg:col-span-2">
              <ImageUploader
                label="Event Image"
                required
                value={form.image}
                onFileSelect={setImageFile}
                disabled={isBusy}
                hint="Select an image — it uploads when you submit"
              />
            </div>
          </div>

          {form.maxCapacity > 0 && form.ticketPrice > 0 && (
            <div className="mt-6 rounded-md border border-surface-border bg-surface-elevated/60 px-4 py-3 text-xs text-gray-300">
              Revenue potential at full capacity:{' '}
              <span className="font-semibold text-white">
                ${revenuePotential.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
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
                  ? 'Saving...'
                  : 'Creating...'
                : isEdit
                  ? 'Save Changes'
                  : 'Create New Event'}
          </button>
        </footer>
      </form>
    </Modal>
  )
}

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Modal } from 'antd'
import { CalendarPlus, ChevronDown, Upload } from 'lucide-react'
import FormControl, { controlClass, textareaClass } from './FormControl'
import {
  EVENT_SIZES,
  revenueOf,
  type EventRecord,
  type EventSize,
} from './eventData'

export type EventFormState = {
  name: string
  about: string
  size: EventSize
  location: string
  capacity: number
  startDate: string
  startTime: string
  ticketPrice: number
  organizer: string
  websiteLink: string
  media: File | null
}

const blankState: EventFormState = {
  name: '',
  about: '',
  size: 'Medium',
  location: '',
  capacity: 0,
  startDate: '',
  startTime: '',
  ticketPrice: 0,
  organizer: '',
  websiteLink: '',
  media: null,
}

const fromEvent = (event: EventRecord): EventFormState => ({
  name: event.name,
  about: event.about,
  size: event.size,
  location: event.location,
  capacity: event.capacity,
  startDate: event.startDate,
  startTime: event.startTime,
  ticketPrice: event.ticketPrice,
  organizer: event.organizer,
  websiteLink: event.websiteLink,
  media: null,
})

type Props = {
  open: boolean
  event: EventRecord | null
  onClose: () => void
  onSubmit: (data: EventFormState) => void
}

export default function EventFormModal({
  open,
  event,
  onClose,
  onSubmit,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<EventFormState>(blankState)

  useEffect(() => {
    if (!open) return
    setForm(event ? fromEvent(event) : blankState)
  }, [open, event])

  const isEdit = event !== null

  const update = <K extends keyof EventFormState>(
    key: K,
    value: EventFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    update('media', file)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    onClose()
  }

  const revenuePotential = revenueOf({
    seatSales: form.capacity,
    ticketPrice: form.ticketPrice,
  })

  return (
    <Modal
      open={open}
      onCancel={onClose}
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
                placeholder="Sabbir Ahmed"
                className={controlClass}
                required
              />
            </FormControl>

            <FormControl label="About This Event">
              <textarea
                value={form.about}
                onChange={(e) => update('about', e.target.value)}
                placeholder="An intimate evening of smooth jazz and cocktails at the Blue Note Lounge."
                className={textareaClass}
              />
            </FormControl>

            <FormControl label="Event Type" required>
              <SelectField
                value={form.size}
                onChange={(v) => update('size', v as EventSize)}
                options={EVENT_SIZES}
              />
            </FormControl>

            <FormControl label="Location" required>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="Enter location"
                className={controlClass}
                required
              />
            </FormControl>

            <FormControl label="Total Capacity" required>
              <input
                type="number"
                min={1}
                value={form.capacity || ''}
                onChange={(e) =>
                  update('capacity', Number(e.target.value) || 0)
                }
                placeholder="45"
                className={controlClass}
                required
              />
            </FormControl>

            <FormControl label="Event Start Date" required>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => update('startDate', e.target.value)}
                className={controlClass}
                required
              />
            </FormControl>

            <FormControl label="Event Start Time" required>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => update('startTime', e.target.value)}
                className={controlClass}
                required
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
                placeholder="$25.00"
                className={controlClass}
                required
              />
            </FormControl>

            <FormControl label="Organizer Name" required>
              <input
                type="text"
                value={form.organizer}
                onChange={(e) => update('organizer', e.target.value)}
                placeholder="Sarah Jenkins"
                className={controlClass}
                required
              />
            </FormControl>

            <div className="lg:row-span-2">
              <span className="mb-2 block text-sm font-medium text-white">
                Upload picture
              </span>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex h-[calc(100%-1.75rem)] min-h-[180px] w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-brand bg-transparent text-sm text-gray-300 transition-colors hover:bg-brand/5"
              >
                <Upload size={26} />
                <span className="truncate px-4">
                  {form.media ? form.media.name : 'Upload Media Picture'}
                </span>
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
            </div>

            <FormControl label="Add Website Link">
              <input
                type="url"
                value={form.websiteLink}
                onChange={(e) => update('websiteLink', e.target.value)}
                placeholder="Select a Business Provider"
                className={controlClass}
              />
            </FormControl>
          </div>

          {form.capacity > 0 && form.ticketPrice > 0 && (
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
            onClick={onClose}
            className="h-10 rounded-md border border-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-10 rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            {isEdit ? 'Save Changes' : 'Create New Event'}
          </button>
        </footer>
      </form>
    </Modal>
  )
}

type SelectFieldProps = {
  value: string
  onChange: (value: string) => void
  options: readonly string[]
}

function SelectField({ value, onChange, options }: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClass} appearance-none pr-10`}
      >
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

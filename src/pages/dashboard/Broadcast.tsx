import { useMemo, useState, type FormEvent } from 'react'
import { message, Select, Switch } from 'antd'
import { ChevronDown, RotateCcw, Send } from 'lucide-react'
import BroadcastPreview from '../../components/dashboard/BroadcastPreview'
import BroadcastHistoryTable from '../../components/dashboard/BroadcastHistoryTable'
import {
  AUDIENCE_SEGMENTS,
  DELIVERY_CHANNELS,
  MESSAGE_LIMIT,
  NOTIFICATION_TYPES,
  initialHistory,
  nextBroadcastId,
  type AudienceSegment,
  type BroadcastRecord,
  type DeliveryChannel,
  type NotificationType,
} from '../../data/broadcastData'

type ComposeState = {
  type: NotificationType
  title: string
  message: string
  audience: AudienceSegment
  channels: DeliveryChannel[]
  scheduleFor: boolean
  scheduledAt: string
}

const initial: ComposeState = {
  type: 'Announcement',
  title: '',
  message: '',
  audience: 'All Users',
  channels: ['In-App'],
  scheduleFor: false,
  scheduledAt: '',
}

export default function Broadcast() {
  const [form, setForm] = useState<ComposeState>(initial)
  const [history, setHistory] = useState<BroadcastRecord[]>(initialHistory)

  const update = <K extends keyof ComposeState>(key: K, value: ComposeState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const audience = useMemo(
    () => AUDIENCE_SEGMENTS.find((a) => a.value === form.audience)!,
    [form.audience],
  )

  const toggleChannel = (channel: DeliveryChannel) =>
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }))

  const reset = () => setForm(initial)

  const send = (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.message.trim()) {
      message.warning('Title and message are required.')
      return
    }
    if (form.channels.length === 0) {
      message.warning('Pick at least one delivery channel.')
      return
    }
    if (form.scheduleFor && !form.scheduledAt) {
      message.warning('Pick a date and time for scheduling.')
      return
    }

    const newRecord: BroadcastRecord = {
      key: `k-${Date.now()}`,
      id: nextBroadcastId(),
      title: form.title.trim(),
      audience: form.audience,
      channels: [...form.channels],
      sentCount: form.scheduleFor ? 0 : audience.count,
      readRate: form.scheduleFor ? null : 0,
      status: form.scheduleFor ? 'Scheduled' : 'Sent',
    }

    setHistory((prev) => [newRecord, ...prev])
    message.success(
      form.scheduleFor ? 'Broadcast scheduled' : 'Broadcast sent',
    )
    reset()
  }

  const charsLeft = MESSAGE_LIMIT - form.message.length

  return (
    <div className="py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Broadcast</h1>
        <p className="text-sm text-gray-400">
          Send notifications and announcements to your users
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <form
          onSubmit={send}
          className="rounded-2xl border border-surface-border bg-surface-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Compose Broadcast</h2>
            <p className="text-sm text-gray-400">
              Craft your message and pick your audience
            </p>
          </div>

          <Field label="Notification Type">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {NOTIFICATION_TYPES.map(({ value, icon: Icon, tone }) => {
                const active = form.type === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update('type', value)}
                    className={`flex flex-col items-center gap-2 rounded-lg border px-3 py-4 transition-colors ${
                      active
                        ? 'border-brand bg-brand/10'
                        : 'border-surface-border bg-surface-page hover:border-brand/50'
                    }`}
                  >
                    <Icon size={20} className={tone} />
                    <span className="text-sm font-medium text-white">
                      {value}
                    </span>
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="Title">
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. New Safety Features Rolled Out"
              maxLength={120}
              className="h-11 w-full rounded-md border border-surface-border bg-surface-page px-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
            />
          </Field>

          <Field
            label="Message"
            trailing={
              <span
                className={`text-xs ${
                  charsLeft < 20 ? 'text-amber-400' : 'text-gray-400'
                }`}
              >
                {form.message.length} / {MESSAGE_LIMIT}
              </span>
            }
          >
            <textarea
              value={form.message}
              onChange={(e) =>
                update('message', e.target.value.slice(0, MESSAGE_LIMIT))
              }
              rows={4}
              placeholder="Write a clear, concise message..."
              className="w-full rounded-md border border-surface-border bg-surface-page p-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
            />
          </Field>

          <Field
            label={`Audience — ${audience.count.toLocaleString()} recipients`}
          >
            <Select
              value={form.audience}
              onChange={(v) => update('audience', v)}
              suffixIcon={<ChevronDown size={16} />}
              className="w-full"
              options={AUDIENCE_SEGMENTS.map((s) => ({
                value: s.value,
                label: `${s.value} (${s.count.toLocaleString()})`,
              }))}
            />
          </Field>

          <Field label="Delivery Channels">
            <div className="flex flex-wrap gap-2">
              {DELIVERY_CHANNELS.map(({ value, icon: Icon }) => {
                const active = form.channels.includes(value)
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleChannel(value)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      active
                        ? 'border-brand bg-brand/10 text-white'
                        : 'border-surface-border text-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon size={14} />
                    {value}
                  </button>
                )
              })}
            </div>
          </Field>

          <div className="rounded-lg border border-surface-border bg-surface-page p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-white">
                  Schedule for later
                </div>
                <div className="text-xs text-gray-400">
                  Pick when this broadcast should go out
                </div>
              </div>
              <Switch
                checked={form.scheduleFor}
                onChange={(checked) => update('scheduleFor', checked)}
              />
            </div>
            {form.scheduleFor && (
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => update('scheduledAt', e.target.value)}
                className="mt-3 h-10 w-full rounded-md border border-surface-border bg-surface-card px-3 text-sm text-white outline-none focus:border-brand"
              />
            )}
          </div>

          <footer className="mt-6 flex items-center justify-end gap-3 border-t border-surface-border pt-5">
            <button
              type="button"
              onClick={reset}
              className="flex h-10 items-center gap-2 rounded-md border border-surface-border px-4 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              type="submit"
              className="flex h-10 items-center gap-2 rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              <Send size={14} />
              {form.scheduleFor ? 'Schedule Broadcast' : 'Send Now'}
            </button>
          </footer>
        </form>

        <BroadcastPreview
          type={form.type}
          title={form.title}
          message={form.message}
        />
      </div>

      <section className="mt-6 rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-white">Broadcast History</h2>
          <p className="text-sm text-gray-400">
            Previously sent and scheduled broadcasts
          </p>
        </header>
        <BroadcastHistoryTable data={history} />
      </section>
    </div>
  )
}

type FieldProps = {
  label: string
  trailing?: React.ReactNode
  children: React.ReactNode
}

function Field({ label, trailing, children }: FieldProps) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-white">{label}</span>
        {trailing}
      </div>
      {children}
    </div>
  )
}

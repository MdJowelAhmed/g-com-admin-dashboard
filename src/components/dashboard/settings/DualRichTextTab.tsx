import { useState } from 'react'
import { message } from 'antd'
import { Briefcase, User } from 'lucide-react'
import RichTextEditor from './RichTextEditor'

export type Audience = 'user' | 'provider'

export type AudienceContent = Record<Audience, string>

type Props = {
  title: string
  description: string
  initial: AudienceContent
}

const audienceMeta: Record<
  Audience,
  { label: string; icon: React.ComponentType<{ size?: number }> }
> = {
  user: { label: 'For Users', icon: User },
  provider: { label: 'For Providers', icon: Briefcase },
}

export default function DualRichTextTab({ title, description, initial }: Props) {
  const [audience, setAudience] = useState<Audience>('user')
  const [content, setContent] = useState<AudienceContent>(initial)
  const [saved, setSaved] = useState<AudienceContent>(initial)

  const current = content[audience]
  const dirty = content[audience] !== saved[audience]
  const otherAudience: Audience = audience === 'user' ? 'provider' : 'user'
  const otherDirty = content[otherAudience] !== saved[otherAudience]

  const handleChange = (html: string) =>
    setContent((prev) => ({ ...prev, [audience]: html }))

  const save = () => {
    setSaved((prev) => ({ ...prev, [audience]: content[audience] }))
    message.success(`${title} saved for ${audienceMeta[audience].label.toLowerCase()}`)
  }

  const reset = () =>
    setContent((prev) => ({ ...prev, [audience]: saved[audience] }))

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        {dirty && (
          <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
            Unsaved changes
          </span>
        )}
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Writing for
        </div>
        <div
          role="tablist"
          className="inline-flex rounded-lg border border-surface-border bg-surface-page p-1"
        >
          {(Object.keys(audienceMeta) as Audience[]).map((key) => {
            const meta = audienceMeta[key]
            const Icon = meta.icon
            const active = key === audience
            const hasUnsaved = content[key] !== saved[key]
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setAudience(key)}
                className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Icon size={14} />
                {meta.label}
                {hasUnsaved && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      active ? 'bg-white' : 'bg-amber-400'
                    }`}
                    aria-label="Unsaved changes"
                  />
                )}
              </button>
            )
          })}
        </div>
        {otherDirty && (
          <p className="mt-2 text-xs text-amber-400">
            You also have unsaved changes on the{' '}
            {audienceMeta[otherAudience].label.toLowerCase()} version.
          </p>
        )}
      </div>

      <RichTextEditor value={current} onChange={handleChange} />

      <div className="flex items-center justify-end gap-3 border-t border-surface-border pt-5">
        <button
          type="button"
          onClick={reset}
          disabled={!dirty}
          className="h-10 rounded-md border border-surface-border px-5 text-sm font-medium text-gray-300 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!dirty}
          className="h-10 rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save for {audienceMeta[audience].label.replace('For ', '')}
        </button>
      </div>
    </div>
  )
}

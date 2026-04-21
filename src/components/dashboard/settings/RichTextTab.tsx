import { useState } from 'react'
import { message } from 'antd'
import RichTextEditor from './RichTextEditor'

type Props = {
  title: string
  description: string
  initialContent: string
}

export default function RichTextTab({ title, description, initialContent }: Props) {
  const [content, setContent] = useState(initialContent)
  const [saved, setSaved] = useState(initialContent)

  const dirty = content !== saved

  const save = () => {
    setSaved(content)
    message.success(`${title} saved`)
  }

  const reset = () => setContent(saved)

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

      <RichTextEditor value={content} onChange={setContent} />

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
          Save {title}
        </button>
      </div>
    </div>
  )
}

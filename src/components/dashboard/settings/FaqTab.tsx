import { useState } from 'react'
import { Popconfirm, message } from 'antd'
import { ChevronDown, Pencil, Plus, Trash2, X } from 'lucide-react'

type FaqItem = {
  id: string
  question: string
  answer: string
}

const initialFaqs: FaqItem[] = [
  {
    id: 'f1',
    question: 'How do I add a new shop to the platform?',
    answer:
      'Go to Shop Management, click Add New Shop, fill in the business details and upload the verification documents. Verification usually completes within 48 hours.',
  },
  {
    id: 'f2',
    question: 'How are payouts scheduled?',
    answer:
      'Direct payouts are processed daily at 2pm UTC. Escrow payouts require manual release from the Earnings & Payouts page.',
  },
  {
    id: 'f3',
    question: 'Can I assign controllers with limited access?',
    answer:
      'Yes — from Controller Management you can pick exactly which pages each controller can access. They only see those pages in the sidebar when they log in.',
  },
]

let counter = 100
const nextId = () => `f-${++counter}`

type Draft = { id?: string; question: string; answer: string } | null

export default function FaqTab() {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs)
  const [expandedId, setExpandedId] = useState<string | null>(initialFaqs[0]?.id ?? null)
  const [draft, setDraft] = useState<Draft>(null)

  const startCreate = () => setDraft({ question: '', answer: '' })
  const startEdit = (faq: FaqItem) =>
    setDraft({ id: faq.id, question: faq.question, answer: faq.answer })
  const cancelDraft = () => setDraft(null)

  const saveDraft = () => {
    if (!draft) return
    const question = draft.question.trim()
    const answer = draft.answer.trim()
    if (!question || !answer) {
      message.warning('Both question and answer are required.')
      return
    }
    if (draft.id) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === draft.id ? { ...f, question, answer } : f)),
      )
      message.success('FAQ updated')
    } else {
      const id = nextId()
      setFaqs((prev) => [...prev, { id, question, answer }])
      setExpandedId(id)
      message.success('FAQ added')
    }
    setDraft(null)
  }

  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id))
    message.success('FAQ removed')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">FAQ</h2>
          <p className="text-sm text-gray-400">
            Answers you'd like users to see inside the app.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {draft && (
        <div className="space-y-3 rounded-xl border border-brand bg-surface-page p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              {draft.id ? 'Edit FAQ' : 'New FAQ'}
            </h3>
            <button
              type="button"
              onClick={cancelDraft}
              aria-label="Cancel"
              className="text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          <input
            type="text"
            value={draft.question}
            onChange={(e) =>
              setDraft((prev) => (prev ? { ...prev, question: e.target.value } : prev))
            }
            placeholder="Question"
            className="h-11 w-full rounded-md border border-surface-border bg-transparent px-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
          />
          <textarea
            value={draft.answer}
            onChange={(e) =>
              setDraft((prev) => (prev ? { ...prev, answer: e.target.value } : prev))
            }
            placeholder="Answer"
            rows={4}
            className="w-full rounded-md border border-surface-border bg-transparent p-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={cancelDraft}
              className="h-9 rounded-md border border-surface-border px-4 text-xs font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveDraft}
              className="h-9 rounded-md bg-brand px-4 text-xs font-semibold text-white hover:bg-brand-hover"
            >
              {draft.id ? 'Save' : 'Add FAQ'}
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {faqs.length === 0 ? (
          <li className="rounded-xl border border-dashed border-surface-border py-12 text-center text-sm text-gray-400">
            No FAQs yet. Add your first one above.
          </li>
        ) : (
          faqs.map((faq) => {
            const open = expandedId === faq.id
            return (
              <li
                key={faq.id}
                className="overflow-hidden rounded-xl border border-surface-border bg-surface-page"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(open ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-400 transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {open && (
                  <div className="space-y-3 border-t border-surface-border px-5 py-4">
                    <p className="whitespace-pre-wrap text-sm text-gray-300">
                      {faq.answer}
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(faq)}
                        className="flex items-center gap-1.5 rounded-md border border-surface-border px-3 py-1.5 text-xs text-amber-300 transition-colors hover:border-amber-500 hover:bg-amber-500/10"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <Popconfirm
                        title="Delete FAQ"
                        description="Remove this question and answer?"
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => deleteFaq(faq.id)}
                      >
                        <button
                          type="button"
                          className="flex items-center gap-1.5 rounded-md border border-surface-border px-3 py-1.5 text-xs text-red-300 transition-colors hover:border-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                )}
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}

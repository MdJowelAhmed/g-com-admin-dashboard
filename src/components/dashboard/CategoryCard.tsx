import { Pencil, Tag } from 'lucide-react'
import type { Category } from './categoryData'

type Props = {
  category: Category
  onEdit: (category: Category) => void
}

export default function CategoryCard({ category, onEdit }: Props) {
  const subCount = category.subCategories.length
  const visible = category.subCategories.slice(0, 3)
  const extra = subCount - visible.length

  return (
    <article className="group overflow-hidden rounded-2xl border border-surface-border bg-surface-card transition-colors hover:border-brand/60">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur">
          <Tag size={11} />
          {subCount} sub-{subCount === 1 ? 'category' : 'categories'}
        </div>

        <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            aria-label={`Edit ${category.name}`}
            onClick={() => onEdit(category)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-amber-300 backdrop-blur transition-colors hover:bg-amber-500/20"
          >
            <Pencil size={14} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-base font-semibold text-white">{category.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {subCount === 0 ? (
            <span className="text-xs italic text-gray-500">
              No sub-categories yet
            </span>
          ) : (
            <>
              {visible.map((sub) => (
                <span
                  key={sub.id}
                  className="rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-gray-200"
                >
                  {sub.name}
                </span>
              ))}
              {extra > 0 && (
                <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-medium text-brand-hover">
                  +{extra} more
                </span>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onEdit(category)}
          className="mt-4 w-full rounded-md border border-surface-border py-2 text-sm font-medium text-gray-300 transition-colors hover:border-brand hover:text-white"
        >
          Manage
        </button>
      </div>
    </article>
  )
}

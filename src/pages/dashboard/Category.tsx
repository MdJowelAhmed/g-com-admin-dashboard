import { useMemo, useState } from 'react'
import { message } from 'antd'
import { Boxes, Search } from 'lucide-react'
import CategoryCard from '../../components/dashboard/CategoryCard'
import CategoryFormModal, {
  type CategoryFormState,
} from '../../components/dashboard/CategoryFormModal'
import {
  initialCategories,
  type Category,
} from '../../data/categoryData'

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Category | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => {
      if (c.name.toLowerCase().includes(q)) return true
      return c.subCategories.some((s) => s.name.toLowerCase().includes(q))
    })
  }, [categories, query])

  const totalSubs = useMemo(
    () => categories.reduce((sum, c) => sum + c.subCategories.length, 0),
    [categories],
  )

  const handleSubmit = (data: CategoryFormState) => {
    if (!editing) return
    setCategories((prev) =>
      prev.map((c) => (c.key === editing.key ? { ...c, ...data } : c)),
    )
    message.success('Category updated')
  }

  return (
    <div className="py-6">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Categories</h1>
          <p className="text-sm text-gray-400">
            {categories.length} fixed hubs · {totalSubs} sub-categories
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute inset-y-0 left-3 my-auto text-gray-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search category or sub-category…"
            className="h-10 w-full rounded-md border border-surface-border bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand"
          />
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border py-20 text-center">
          <Boxes size={32} className="mb-3 text-gray-500" strokeWidth={1.5} />
          <p className="text-sm text-gray-300">
            No categories match your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {filtered.map((category) => (
            <CategoryCard
              key={category.key}
              category={category}
              onEdit={setEditing}
            />
          ))}
        </div>
      )}

      <CategoryFormModal
        open={editing !== null}
        category={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

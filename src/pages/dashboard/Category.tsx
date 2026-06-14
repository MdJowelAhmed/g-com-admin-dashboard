import { useMemo, useState } from 'react'
import { Spin } from 'antd'
import { Boxes, Search } from 'lucide-react'
import CategoryCard from '../../components/dashboard/CategoryCard'
import CategoryFormModal from '../../components/dashboard/CategoryFormModal'
import {
  API_TO_CATEGORY_KEY,
  CATEGORY_TO_API,
  initialCategories,
  type Category,
} from '../../data/categoryData'
import {
  mapSubCategoryFromApi,
  useGetSubCategoriesQuery,
} from '../../redux/api/subCategoryApi'

function useCategorySubCategories(categoryKey: string) {
  const apiCategory = CATEGORY_TO_API[categoryKey]
  return useGetSubCategoriesQuery(
    { category: apiCategory },
    { skip: !apiCategory },
  )
}

export default function CategoryPage() {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Category | null>(null)

  const servicesQuery = useCategorySubCategories('services')
  const stayQuery = useCategorySubCategories('stay')
  const dineQuery = useCategorySubCategories('dine')
  const shopsQuery = useCategorySubCategories('shops')
  const eventsQuery = useCategorySubCategories('events')

  const subCategoryQueries = [
    servicesQuery,
    stayQuery,
    dineQuery,
    shopsQuery,
    eventsQuery,
  ]

  const isLoading = subCategoryQueries.some((q) => q.isLoading)
  const isError = subCategoryQueries.some((q) => q.isError)

  const categories = useMemo(() => {
    const subsByCategoryKey: Record<string, Category['subCategories']> = {}
    const queryResults = [
      servicesQuery,
      stayQuery,
      dineQuery,
      shopsQuery,
      eventsQuery,
    ]

    for (const query of queryResults) {
      for (const doc of query.data?.data ?? []) {
        const categoryKey = API_TO_CATEGORY_KEY[doc.category]
        if (!categoryKey) continue
        subsByCategoryKey[categoryKey] = [
          ...(subsByCategoryKey[categoryKey] ?? []),
          mapSubCategoryFromApi(doc),
        ]
      }
    }

    return initialCategories.map((category) => ({
      ...category,
      subCategories: subsByCategoryKey[category.key] ?? [],
    }))
  }, [
    servicesQuery.data,
    stayQuery.data,
    dineQuery.data,
    shopsQuery.data,
    eventsQuery.data,
  ])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((category) => {
      if (category.name.toLowerCase().includes(q)) return true
      return category.subCategories.some((sub) =>
        sub.name.toLowerCase().includes(q),
      )
    })
  }, [categories, query])

  const totalSubs = useMemo(
    () => categories.reduce((sum, category) => sum + category.subCategories.length, 0),
    [categories],
  )

  const editingCategory = useMemo(
    () =>
      editing
        ? categories.find((category) => category.key === editing.key) ?? editing
        : null,
    [categories, editing],
  )

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

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border py-20 text-center">
          <p className="text-sm text-red-400">
            Failed to load sub-categories. Please try again.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border py-20 text-center">
          <Boxes size={32} className="mb-3 text-gray-500" strokeWidth={1.5} />
          <p className="text-sm text-gray-300">
            No categories match your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 xl:gap-10">
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
        open={editingCategory !== null}
        category={editingCategory}
        onClose={() => setEditing(null)}
      />
    </div>
  )
}

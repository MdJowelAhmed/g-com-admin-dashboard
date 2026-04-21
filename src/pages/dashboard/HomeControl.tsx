import { useState } from 'react'
import { Plus } from 'lucide-react'
import PromotionsTable, {
  type Promotion,
} from '../../components/dashboard/PromotionsTable'
import AddPromotionModal from '../../components/dashboard/AddPromotionModal'

const initialPromotions: Promotion[] = [
  {
    key: '1',
    sl: '01',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&h=120&fit=crop',
    title: 'Americano',
    startDate: '27 Oct 2025',
    startTime: '13:00 pm',
    endDate: '27 Oct 2025',
    endTime: '13:00 pm',
    type: 'Billboard Carousel',
    amount: 65,
    status: 'Completed',
    published: true,
  },
  {
    key: '2',
    sl: '02',
    image:
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=120&h=120&fit=crop',
    title: 'Cappuccino',
    startDate: '28 Oct 2025',
    startTime: '09:30 am',
    endDate: '27 Oct 2025',
    endTime: '13:00 pm',
    type: 'Latest Promotions',
    amount: 45,
    status: 'Pending',
    published: true,
  },
  {
    key: '3',
    sl: '03',
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&h=120&fit=crop',
    title: 'Latte',
    startDate: '29 Oct 2025',
    startTime: '15:45 pm',
    endDate: '27 Oct 2025',
    endTime: '13:00 pm',
    type: 'Sponsored Deals',
    amount: 78,
    status: 'In Progress',
    published: false,
  },
]

export default function HomeControl() {
  const [promotions, setPromotions] = useState(initialPromotions)
  const [modalOpen, setModalOpen] = useState(false)

  const handleDelete = (key: string) =>
    setPromotions((prev) => prev.filter((p) => p.key !== key))

  const handleTogglePublish = (key: string, next: boolean) =>
    setPromotions((prev) =>
      prev.map((p) => (p.key === key ? { ...p, published: next } : p)),
    )

  return (
    <div className="py-6">
      <section className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-white">Promotion</h1>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            <Plus size={16} />
            Add New Promotion
          </button>
        </header>

        <div className="mt-6">
          <PromotionsTable
            data={promotions}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
          />
        </div>
      </section>

      <AddPromotionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

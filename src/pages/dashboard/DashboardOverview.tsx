import { Package, Store, TrendingUp, Users } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import RevenueChart from '../../components/dashboard/RevenueChart'
import VerificationQueue from '../../components/dashboard/VerificationQueue'
import RecentOrdersTable from '../../components/dashboard/RecentOrdersTable'

const stats = [
  { label: 'Total Orders', value: '12,450', icon: Package },
  { label: 'Total Business', value: '$4,367', icon: Store },
  { label: 'Total User', value: '540', icon: Users },
  { label: 'Total Revenue', value: '$5,400', icon: TrendingUp },
]

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <RevenueChart />
        <VerificationQueue />
      </section>

      <RecentOrdersTable />
    </div>
  )
}

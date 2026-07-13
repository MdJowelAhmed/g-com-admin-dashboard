import { Package, Store, TrendingUp, Users } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import RevenueChart from '../../components/dashboard/RevenueChart'
import RecentOrdersTable from '../../components/dashboard/RecentOrdersTable'
import { useGetOverviewStatsQuery } from '../../redux/api/overviewApi'

export default function DashboardOverview() {
  const { data, isLoading } = useGetOverviewStatsQuery()
  const stats = data?.data

  const statCards = [
    {
      label: 'Total Orders',
      value: stats ? stats.totalOrders.toLocaleString() : '—',
      icon: Package,
    },
    {
      label: 'Total Business',
      value: stats ? stats.totalBusinesses.toLocaleString() : '—',
      icon: Store,
    },
    {
      label: 'Total User',
      value: stats ? stats.totalUsers.toLocaleString() : '—',
      icon: Users,
    },
    {
      label: 'Total Revenue',
      value: stats ? `GH₵${stats.totalRevenue.toLocaleString()}` : '—',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <section
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4${isLoading ? ' opacity-70' : ''}`}
      >
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]"> */}
      <section className="">
        <RevenueChart />
        {/* <VerificationQueue /> */}
      </section>

      <RecentOrdersTable />
    </div>
  )
}
